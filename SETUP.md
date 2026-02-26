# Clothes Recognition System - Setup Guide

## Installation

### 1. Backend Setup (Python)
\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 2. Run the Flask Server
\`\`\`bash
python app.py
\`\`\`
The server will start on `http://localhost:5000`

### 3. Open Frontend
- Open `index.html` in your web browser (or use a local server)
- Or use: `python -m http.server 8000` and go to `http://localhost:8000`

## Features

1. **Image Upload/Camera Capture** - Upload photos or take pictures
2. **AI Clothing Recognition** - Uses pre-trained transformer model to identify clothing
3. **Star Rating System** - Rate recognized items 1-5 stars
4. **Smart Suggestions** - Get recommendations based on your high ratings
5. **Rating History** - View all items you've rated in the current session

## How It Works

1. Upload an image of your clothing
2. AI recognizes the clothing item
3. Rate the item using star ratings
4. Get personalized suggestions based on items you rated 4+ stars
5. See your rating history

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Python Flask with Transformers
- **AI Model**: Facebook BART Large MNLI (zero-shot classification)
- **Image Processing**: PIL (Python Imaging Library)
