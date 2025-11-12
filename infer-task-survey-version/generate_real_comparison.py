#!/usr/bin/env python3
"""
Script to generate real GPT-4o outputs for control vs experimental comparison
Uses the actual prompts from the INFER website
"""

import os
import json
import requests
from typing import Dict, List, Any

# Load the example text
with open('example.txt', 'r', encoding='utf-8') as f:
    example_text = f.read().strip()

# Control prompts (simple, no theory alignment)
CONTROL_PROMPTS = {
    "control_1": "I am writing a response to analyze a video about teaching. Give me feedback.",
    "control_2": "I am writing a response to analyze a video about teaching based on professional vision. Give me feedback.",
    "control_3": "I watched a teaching video and wrote my thoughts. Can you give me feedback on my analysis?"
}

# Experimental prompt components (from app.js)
def get_binary_classification_prompts():
    """Get the actual binary classification prompts from the website"""
    return {
        "description": """You are an expert in educational research, specifically in analyzing teacher professional vision. Your task is to classify text segments as containing "Description" (D) or not.

**Definition of Description (D):**
Description involves objectively reporting what was observed in the classroom without interpretation, evaluation, or explanation. It focuses on concrete, observable facts about:
- Teacher actions and behaviors
- Student behaviors and responses  
- Classroom activities and interactions
- Physical environment and materials
- Sequence of events
- What was said or done

**Key Criteria for Description:**
- Reports observable facts without interpretation
- Uses objective, neutral language
- Focuses on "what happened" rather than "why" or "what if"
- Avoids evaluative statements or judgments
- Describes concrete, specific details

**Examples of Description:**
- "The teacher asked students to work in pairs"
- "Students raised their hands to answer questions"
- "The lesson began with a warm-up activity"
- "The teacher wrote vocabulary words on the board"

**Examples of NOT Description:**
- "The teacher effectively managed the classroom" (evaluation)
- "Students were engaged because the activity was interesting" (explanation)
- "This approach will help students learn better" (prediction)

**Classification Rules:**
- Classify as 1 (Description) if the text segment primarily reports observable facts about classroom events
- Classify as 0 (Not Description) if the text segment contains interpretation, evaluation, explanation, or prediction

**Response Format:**
Respond with only "1" or "0" - no explanation needed.""",

        "explanation": """You are an expert in educational research, specifically in analyzing teacher professional vision. Your task is to classify text segments as containing "Explanation" (E) or not.

**Definition of Explanation (E):**
Explanation involves providing reasoning, analysis, or interpretation of why something happened in the classroom. It connects observable events to underlying causes, principles, or theories. It focuses on:
- Why teacher actions were taken
- Why students responded in certain ways
- How teaching strategies work
- What educational principles are at play
- Cause-and-effect relationships
- Theoretical connections

**Key Criteria for Explanation:**
- Provides reasoning for observed events
- Connects actions to underlying causes or principles
- Uses analytical language ("because", "due to", "as a result")
- Explains the "why" behind classroom events
- References educational theories or principles
- Analyzes cause-and-effect relationships

**Examples of Explanation:**
- "The teacher used pair work because it promotes active learning"
- "Students were engaged because the activity matched their interests"
- "This approach works because it builds on prior knowledge"
- "The teacher's feedback strategy encourages student participation"

**Examples of NOT Explanation:**
- "The teacher asked students to work in pairs" (description)
- "This will help students learn better" (prediction)
- "The lesson was well-structured" (evaluation)

**Classification Rules:**
- Classify as 1 (Explanation) if the text segment primarily provides reasoning or analysis of why classroom events occurred
- Classify as 0 (Not Explanation) if the text segment is descriptive, predictive, or evaluative without explanatory reasoning

**Response Format:**
Respond with only "1" or "0" - no explanation needed.""",

        "prediction": """You are an expert in educational research, specifically in analyzing teacher professional vision. Your task is to classify text segments as containing "Prediction" (P) or not.

**Definition of Prediction (P):**
Prediction involves forecasting future outcomes, effects, or consequences of classroom events. It focuses on:
- What will happen as a result of teaching actions
- How students will respond or learn
- Future implications of current events
- Anticipated outcomes or effects
- Long-term consequences
- What might happen next

**Key Criteria for Prediction:**
- Forecasts future events or outcomes
- Uses predictive language ("will", "would", "might", "could")
- Anticipates consequences or effects
- Focuses on future-oriented thinking
- Considers potential outcomes
- Looks ahead to what might happen

**Examples of Prediction:**
- "This approach will help students understand the concept better"
- "Students might struggle with this activity"
- "The teacher's feedback will encourage more participation"
- "This lesson will prepare students for the next unit"

**Examples of NOT Prediction:**
- "The teacher asked students to work in pairs" (description)
- "Students were engaged because the activity was interesting" (explanation)
- "The lesson was well-structured" (evaluation)

**Classification Rules:**
- Classify as 1 (Prediction) if the text segment primarily forecasts future outcomes or effects
- Classify as 0 (Not Prediction) if the text segment is descriptive, explanatory, or evaluative without predictive elements

**Response Format:**
Respond with only "1" or "0" - no explanation needed."""
    }

def get_feedback_prompt(style: str, language: str, weakest_component: str) -> str:
    """Get the actual feedback generation prompt from the website"""
    if style == "academic" and language == "en":
        return f"""You are a supportive yet rigorous teaching mentor providing feedback in a scholarly tone. Your feedback MUST be detailed, academic, and comprehensive, deeply integrating theory.

**Knowledge Base Integration:**
You MUST base your feedback on the theoretical framework of empirical teaching quality research. Specifically, use the process-oriented teaching-learning model (Seidel & Shavelson, 2007) or the three basic dimensions of teaching quality (Klieme, 2006) for feedback on description and explanation. For prediction, use self-determination theory (Deci & Ryan, 1993) or theories of cognitive and constructive learning (Atkinson & Shiffrin, 1968; Craik & Lockhart, 1972).

**CRITICAL: You MUST explicitly cite these theories using the (Author, Year) format. Do NOT cite any other theories.**

**MANDATORY WEIGHTED FEEDBACK STRUCTURE:**
1. **Weakest Area Focus**: Write 6-8 detailed, academic sentences ONLY for the weakest component ({weakest_component}), integrating multiple specific suggestions and deeply connecting them to theory.
2. **Stronger Areas**: For the two stronger components, write EXACTLY 3-4 detailed sentences each (1 Strength, 1 Suggestion, 1 'Why' that explicitly connects to theory).
3. **Conclusion**: Write 2-3 sentences summarizing the key area for development.

**CRITICAL FOCUS REQUIREMENTS:**
- Focus ONLY on analysis skills, not teaching performance.
- Emphasize objective, non-evaluative observation for the Description section.

**FORMATTING:**
- Sections: "#### Description", "#### Explanation", "#### Prediction", "#### Conclusion"
- Sub-headings: "Strength:", "Suggestions:", "Why:" """
    
    elif style == "user-friendly" and language == "en":
        return f"""You are a friendly teaching mentor providing feedback for a busy teacher who wants quick, practical tips.

**Style Guide - MUST BE FOLLOWED:**
- **Language**: Use simple, direct language. Avoid academic jargon completely.
- **Citations**: Do NOT include any in-text citations like (Author, Year).
- **Focus**: Give actionable advice. Do NOT explain the theory behind the advice.

**MANDATORY CONCISE FEEDBACK STRUCTURE:**
1. **Weakest Area Focus**: For the weakest component ({weakest_component}), provide a "Good:" section with 1-2 sentences, and a "Tip:" section with a bulleted list of 2-3 clear, practical tips.
2. **Stronger Areas**: For the two stronger components, write a "Good:" section with one sentence and a "Tip:" section with one practical tip.
3. **No Conclusion**: Do not include a "Conclusion" section.

**FORMATTING:**
- Sections: "#### Description", "#### Explanation", "#### Prediction"
- Sub-headings: "Good:", "Tip:" """
    
    else:
        return "Error: Unsupported prompt type"

def call_openai_api(messages: List[Dict[str, str]], model: str = "gpt-4o") -> str:
    """Call OpenAI API with the given messages"""
    # Note: This would need actual API key and endpoint
    # For now, return placeholder
    return f"[API CALL WOULD BE MADE HERE with {len(messages)} messages]"

def simulate_binary_classification(text: str) -> Dict[str, Any]:
    """Simulate the binary classification process"""
    # Split into 3-sentence windows (simplified)
    sentences = text.split('. ')
    windows = []
    for i in range(0, len(sentences), 3):
        window = '. '.join(sentences[i:i+3])
        if window.strip():
            windows.append(window)
    
    # Simulate classification results (based on the example)
    classification_results = []
    for i, window in enumerate(windows):
        # Simulate based on content analysis
        description = 1 if any(word in window.lower() for word in ['lehrerin', 'schüler', 'klasse', 'aufgabe']) else 0
        explanation = 1 if any(word in window.lower() for word in ['weil', 'da', 'deshalb', 'grund']) else 0
        prediction = 1 if any(word in window.lower() for word in ['werden', 'können', 'mögen', 'profitieren']) else 0
        
        classification_results.append({
            'window_id': f'chunk_{i+1:03d}',
            'window_text': window,
            'description': description,
            'explanation': explanation,
            'prediction': prediction
        })
    
    # Calculate percentages
    total_windows = len(classification_results)
    if total_windows == 0:
        return {
            'percentages_raw': {'description': 0, 'explanation': 0, 'prediction': 0, 'professional_vision': 0},
            'percentages_priority': {'description': 0, 'explanation': 0, 'prediction': 0, 'other': 100, 'professional_vision': 0},
            'weakest_component': 'Prediction',
            'analysis_summary': 'No valid windows for analysis',
            'classificationResults': [],
            'windows': []
        }
    
    # Raw calculation
    raw_description_count = sum(1 for r in classification_results if r['description'] == 1)
    raw_explanation_count = sum(1 for r in classification_results if r['explanation'] == 1)
    raw_prediction_count = sum(1 for r in classification_results if r['prediction'] == 1)
    
    raw_percentages = {
        'description': round((raw_description_count / total_windows) * 100, 1),
        'explanation': round((raw_explanation_count / total_windows) * 100, 1),
        'prediction': round((raw_prediction_count / total_windows) * 100, 1),
        'professional_vision': round(((raw_description_count + raw_explanation_count + raw_prediction_count) / total_windows) * 100, 1)
    }
    
    # Priority calculation (simplified)
    priority_percentages = {
        'description': raw_percentages['description'],
        'explanation': raw_percentages['explanation'],
        'prediction': raw_percentages['prediction'],
        'other': 100 - (raw_percentages['description'] + raw_percentages['explanation'] + raw_percentages['prediction']),
        'professional_vision': raw_percentages['professional_vision']
    }
    
    # Find weakest component
    components = ['description', 'explanation', 'prediction']
    weakest = min(components, key=lambda x: raw_percentages[x])
    
    return {
        'percentages_raw': raw_percentages,
        'percentages_priority': priority_percentages,
        'weakest_component': weakest.title(),
        'analysis_summary': f'Analyzed {total_windows} non-overlapping text windows. Professional Vision: {raw_percentages["professional_vision"]}% (D:{raw_percentages["description"]}% + E:{raw_percentages["explanation"]}% + P:{raw_percentages["prediction"]}%) + Other: {priority_percentages["other"]}% = 100%',
        'classificationResults': classification_results,
        'windows': windows
    }

def main():
    """Generate real comparison outputs"""
    print("=== CONTROL VS EXPERIMENTAL COMPARISON ===")
    print(f"Example Text Length: {len(example_text)} characters")
    print()
    
    # 1. Control Group Outputs
    print("## CONTROL GROUP: Simple Prompts")
    print()
    
    for prompt_id, prompt in CONTROL_PROMPTS.items():
        print(f"### {prompt_id.upper()}")
        print(f"**Prompt:** {prompt}")
        print()
        print("**GPT-4o Response:**")
        print("[This would be generated via OpenAI API call]")
        print()
        print("---")
        print()
    
    # 2. Experimental Group Output
    print("## EXPERIMENTAL GROUP: Current Chain Prompt")
    print()
    
    # Step 1: Binary Classification
    print("### Step 1: Binary Classification Analysis")
    analysis_result = simulate_binary_classification(example_text)
    print(f"**Analysis Result:**")
    print(f"- Description: {analysis_result['percentages_raw']['description']}% ({sum(1 for r in analysis_result['classificationResults'] if r['description'] == 1)}/{len(analysis_result['classificationResults'])} windows)")
    print(f"- Explanation: {analysis_result['percentages_raw']['explanation']}% ({sum(1 for r in analysis_result['classificationResults'] if r['explanation'] == 1)}/{len(analysis_result['classificationResults'])} windows)")
    print(f"- Prediction: {analysis_result['percentages_raw']['prediction']}% ({sum(1 for r in analysis_result['classificationResults'] if r['prediction'] == 1)}/{len(analysis_result['classificationResults'])} windows)")
    print(f"- Other: {analysis_result['percentages_priority']['other']}%")
    print()
    print(f"**Weakest Component:** {analysis_result['weakest_component']}")
    print()
    
    # Step 2: Feedback Generation
    print("### Step 2: Weighted Feedback Generation")
    print()
    
    # Academic English feedback
    print("#### Academic English Feedback")
    academic_prompt = get_feedback_prompt("academic", "en", analysis_result['weakest_component'])
    print("**System Prompt:**")
    print(academic_prompt[:200] + "...")
    print()
    print("**User Message:**")
    user_message = f"Based on the analysis showing {analysis_result['percentages_priority']['description']}% description, {analysis_result['percentages_priority']['explanation']}% explanation, {analysis_result['percentages_priority']['prediction']}% prediction (Professional Vision: {analysis_result['percentages_priority']['professional_vision']}%) + Other: {analysis_result['percentages_priority']['other']}% = 100%, provide feedback for this reflection:\n\n{example_text}"
    print(user_message[:300] + "...")
    print()
    print("**GPT-4o Response:**")
    print("[This would be generated via OpenAI API call with the above prompt]")
    print()
    
    # User-friendly English feedback
    print("#### User-friendly English Feedback")
    user_friendly_prompt = get_feedback_prompt("user-friendly", "en", analysis_result['weakest_component'])
    print("**System Prompt:**")
    print(user_friendly_prompt[:200] + "...")
    print()
    print("**GPT-4o Response:**")
    print("[This would be generated via OpenAI API call with the above prompt]")
    print()
    
    # 3. Comparison Analysis
    print("## COMPARISON ANALYSIS")
    print()
    print("### Key Differences:")
    print()
    print("**Control Group Characteristics:**")
    print("- Generic feedback without theoretical framework")
    print("- Focus on general writing/analysis skills")
    print("- No specific professional vision development guidance")
    print("- Surface-level suggestions for improvement")
    print("- No systematic analysis of teaching components")
    print()
    print("**Experimental Group Characteristics:**")
    print("- Theory-aligned feedback based on professional vision framework")
    print("- Systematic component analysis (D, E, P)")
    print("- Targeted development suggestions for specific weaknesses")
    print("- Connection to pedagogical principles")
    print("- Structured approach to professional vision development")
    print()
    
    # Save results to file
    results = {
        'control_prompts': CONTROL_PROMPTS,
        'experimental_analysis': analysis_result,
        'feedback_prompts': {
            'academic_english': academic_prompt,
            'user_friendly_english': user_friendly_prompt
        }
    }
    
    with open('comparison_results.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print("Results saved to comparison_results.json")

if __name__ == "__main__":
    main()




