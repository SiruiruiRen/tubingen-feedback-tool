# Data Export Guide - INFER Simplified Version

## Overview

This version stores **all binary classification results** locally in the browser's localStorage. This includes:
- Individual window classifications (Description, Explanation, Prediction)
- Analysis percentages
- Participant information
- Timestamps

## How to Export Data

### Method 1: Browser Console (Easiest)

1. **Open the site where participants completed the study**
   - URL: https://infer-task-survey.netlify.app (or your Render URL)

2. **Open Browser Console:**
   - Chrome/Edge: Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
   - Firefox: Press `F12`
   - Safari: Enable Developer menu first, then `Cmd+Option+C`

3. **Run Export Command:**
   ```javascript
   exportAllClassificationData()
   ```

4. **Download File:**
   - A JSON file will automatically download
   - Filename: `infer_classification_data_[timestamp].json`

### Method 2: Manual Retrieval

Open browser console and run:

```javascript
// Get all classification keys
const allKeys = JSON.parse(localStorage.getItem('all_classification_keys') || '[]');

// Get specific task data
const task1Data = allKeys
    .filter(key => key.startsWith('task1'))
    .map(key => JSON.parse(localStorage.getItem(key)));

const task2Data = allKeys
    .filter(key => key.startsWith('task2'))
    .map(key => JSON.parse(localStorage.getItem(key)));

console.log('Task 1:', task1Data);
console.log('Task 2:', task2Data);
```

## Data Structure

Each stored entry contains:

```json
{
  "timestamp": "2025-10-16T12:34:56.789Z",
  "task_id": "task1",
  "participant_name": "John Doe",
  "video_id": "spider",
  "language": "en",
  "analysis_summary": {
    "percentages": {
      "description": 35,
      "explanation": 40,
      "prediction": 20,
      "other": 5,
      "professional_vision": 95
    },
    "weakest_component": "Prediction",
    "total_windows": 8
  },
  "binary_classifications": [
    {
      "window_id": "chunk_001",
      "window_text": "The teacher asked open questions...",
      "description": 1,
      "explanation": 1,
      "prediction": 0
    },
    {
      "window_id": "chunk_002",
      "window_text": "Students may feel motivated...",
      "description": 0,
      "explanation": 0,
      "prediction": 1
    }
  ],
  "windows": [
    {
      "id": "chunk_001",
      "text": "The teacher asked open questions..."
    }
  ]
}
```

## Binary Classification Values

- **1** = Feature present (e.g., window contains description)
- **0** = Feature absent (e.g., window does not contain description)

Each window gets three binary classifications:
- `description`: 0 or 1
- `explanation`: 0 or 1
- `prediction`: 0 or 1

## Analysis Display

The analysis is **automatically shown** to participants above the feedback:

**English:**
> Analysis of Your Reflection
> 
> Your reflection contains 35% description, 40% explanation, and 20% prediction. Prediction can be strengthened.

**German:**
> Analyse Ihrer Reflexion
> 
> Ihre Reflexion enthält 35% Beschreibung, 40% Erklärung und 20% Vorhersage. Prediction kann gestärkt werden.

## What Gets Stored

### For Each Feedback Generation:
✅ Timestamp  
✅ Task ID (task1 or task2)  
✅ Participant name  
✅ Video ID  
✅ Language  
✅ Analysis percentages  
✅ Weakest component  
✅ **All binary classification results** for each window  
✅ Window texts  

### Storage Location:
- **Browser:** localStorage (persists even after closing browser)
- **Limitation:** Data is specific to that browser/device
- **Solution:** Export data after each session

## Best Practices

### During Study:

1. **After each participant session:**
   - Open the browser console
   - Run `exportAllClassificationData()`
   - Save the JSON file immediately
   - File name includes timestamp for tracking

2. **Backup regularly:**
   - Export data every few participants
   - Keep backups in multiple locations

3. **Clear data if needed:**
   ```javascript
   // Clear all classification data
   const allKeys = JSON.parse(localStorage.getItem('all_classification_keys') || '[]');
   allKeys.forEach(key => localStorage.removeItem(key));
   localStorage.removeItem('all_classification_keys');
   ```

### After Study:

1. **Consolidate all JSON files:**
   - Each export contains all data up to that point
   - Use the most recent export for complete dataset
   - Or merge multiple exports if needed

2. **Data analysis:**
   - Load JSON into Python/R
   - Each participant may have multiple entries (revisions)
   - Track by timestamp and task_id

## Python Example

```python
import json
import pandas as pd

# Load the exported data
with open('infer_classification_data_2025-10-16T12:34:56.json', 'r') as f:
    data = json.load(f)

# Convert to DataFrame
df = pd.json_normalize(data)

# Extract binary classifications
classifications = []
for entry in data:
    for classification in entry['binary_classifications']:
        classifications.append({
            'participant': entry['participant_name'],
            'task_id': entry['task_id'],
            'window_id': classification['window_id'],
            'description': classification['description'],
            'explanation': classification['explanation'],
            'prediction': classification['prediction'],
            'window_text': classification['window_text']
        })

classifications_df = pd.DataFrame(classifications)
```

## Limitations

⚠️ **localStorage limits:**
- ~5-10MB per domain (browser dependent)
- Should handle ~50-100 participants easily
- Export regularly to prevent data loss

⚠️ **Browser-specific:**
- Data stored per browser
- Clearing browser data = data loss
- Always export after sessions!

## Advantages

✅ **No database setup needed**  
✅ **Instant storage** (no network latency)  
✅ **Privacy-friendly** (data stays on your computer)  
✅ **Easy to export** (one command)  
✅ **Complete classification results** (all windows, all scores)  

## Troubleshooting

### "localStorage is full"
```javascript
// Check size
let size = 0;
for (let key in localStorage) {
    size += localStorage[key].length;
}
console.log(`localStorage size: ${(size / 1024).toFixed(2)} KB`);

// Export and clear old data
exportAllClassificationData();
// Then clear if needed
```

### "Data not found"
- Make sure you're on the same browser/device
- Check if data was exported before clearing
- Run: `localStorage.getItem('all_classification_keys')` to see what's stored

## Summary

This simplified version provides:
- ✅ Same analysis as research version
- ✅ Same chain prompting process
- ✅ All binary classifications stored
- ✅ Easy data export
- ✅ No database dependency

Perfect for small-scale studies and quick deployments!

