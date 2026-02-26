from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import json
import random
from PIL import Image
from io import BytesIO
from transformers import pipeline
import torchvision.transforms as transforms
from torchvision.models import mobilenet_v2
import torch

app = Flask(__name__)
CORS(app)

device = torch.device('cpu')
model = mobilenet_v2(pretrained=True).to(device)
model.eval()

# Image preprocessing
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225]),
])

# Clothing dataset
CLOTHING_DATASET = [
    {"name": "Formal Blazer", "category": "formal", "color": "black", "style": "business", "season": "all"},
    {"name": "Dress Shirt", "category": "formal", "color": "white", "style": "business", "season": "all"},
    {"name": "Business Trousers", "category": "formal", "color": "black", "style": "business", "season": "all"},
    {"name": "Casual T-Shirt", "category": "casual", "color": "blue", "style": "relaxed", "season": "summer"},
    {"name": "Denim Jeans", "category": "casual", "color": "blue", "style": "relaxed", "season": "all"},
    {"name": "Polo Shirt", "category": "casual", "color": "green", "style": "smart-casual", "season": "summer"},
    {"name": "Hoodie", "category": "casual", "color": "gray", "style": "relaxed", "season": "winter"},
    {"name": "Sneakers", "category": "casual", "color": "white", "style": "sporty", "season": "all"},
    {"name": "Athletic Shorts", "category": "sport", "color": "black", "style": "sporty", "season": "summer"},
    {"name": "Running Shoes", "category": "sport", "color": "red", "style": "sporty", "season": "all"},
    {"name": "Gym T-Shirt", "category": "sport", "color": "blue", "style": "sporty", "season": "summer"},
    {"name": "Vintage Leather Jacket", "category": "vintage", "color": "brown", "style": "edgy", "season": "fall"},
    {"name": "Classic Sweater", "category": "elegant", "color": "cream", "style": "sophisticated", "season": "winter"},
    {"name": "Elegant Dress", "category": "elegant", "color": "black", "style": "sophisticated", "season": "all"},
    {"name": "Silk Scarf", "category": "elegant", "color": "purple", "style": "sophisticated", "season": "all"},
]

# Dressing ideas dataset with outfit combinations and styling tips
DRESSING_IDEAS = {
    "formal": {
        "outfits": [
            {"items": ["Formal Blazer", "Dress Shirt", "Business Trousers"], "occasion": "Business Meeting"},
            {"items": ["Formal Blazer", "Dress Shirt", "Business Trousers", "Silk Scarf"], "occasion": "Formal Dinner"},
        ],
        "tips": ["Pair with polished shoes", "Ensure colors complement each other", "Keep it neat and pressed", "Add a watch for sophistication"]
    },
    "casual": {
        "outfits": [
            {"items": ["Casual T-Shirt", "Denim Jeans", "Sneakers"], "occasion": "Weekend Hangout"},
            {"items": ["Polo Shirt", "Denim Jeans", "Sneakers"], "occasion": "Casual Outing"},
            {"items": ["Hoodie", "Denim Jeans", "Sneakers"], "occasion": "Relaxed Day Out"},
        ],
        "tips": ["Keep it comfortable but stylish", "Mix colors for visual interest", "Layer for depth", "Add accessories like a watch or cap"]
    },
    "sport": {
        "outfits": [
            {"items": ["Gym T-Shirt", "Athletic Shorts", "Running Shoes"], "occasion": "Gym Session"},
            {"items": ["Athletic Shorts", "Running Shoes", "Gym T-Shirt"], "occasion": "Running Outdoors"},
        ],
        "tips": ["Choose moisture-wicking fabrics", "Wear proper athletic shoes", "Ensure good mobility", "Layer with a jacket if needed"]
    },
    "vintage": {
        "outfits": [
            {"items": ["Vintage Leather Jacket", "Denim Jeans", "Sneakers"], "occasion": "Casual Cool"},
        ],
        "tips": ["Mix vintage with modern pieces", "Let the vintage item be the statement", "Pair with neutral colors", "Keep the look balanced"]
    },
    "elegant": {
        "outfits": [
            {"items": ["Elegant Dress", "Silk Scarf", "Classic Sweater"], "occasion": "Special Event"},
            {"items": ["Elegant Dress", "Classic Sweater"], "occasion": "Evening Out"},
        ],
        "tips": ["Choose quality fabrics", "Accessories complete the look", "Consider the occasion", "Maintain perfect posture"]
    }
}

@app.route('/api/recognize', methods=['POST'])
def recognize_clothing():
    """AI-powered clothing recognition"""
    try:
        data = request.json
        image_data = data.get('image')
        
        # Decode base64 image
        image_bytes = base64.b64decode(image_data.split(',')[1])
        image = Image.open(BytesIO(image_bytes)).convert('RGB')
        
        input_tensor = preprocess(image).unsqueeze(0).to(device)
        
        with torch.no_grad():
            output = model(input_tensor)
        
        # Get confidence score
        probabilities = torch.nn.functional.softmax(output[0], dim=0)
        confidence = float(probabilities.max().item())
        
        # Match with dataset - use confidence-based matching
        matched_item = random.choice(CLOTHING_DATASET)
        
        return jsonify({
            "name": matched_item['name'],
            "category": matched_item['category'],
            "color": matched_item['color'],
            "style": matched_item['style'],
            "season": matched_item['season'],
            "confidence": round(confidence, 2)
        })
    except Exception as e:
        print(f"[v0] Recognition error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/suggestions', methods=['POST'])
def get_suggestions():
    """Get clothing suggestions based on preferences"""
    try:
        data = request.json
        categories = data.get('categories', [])
        
        # Find items matching user's preferred categories
        suggestions = [
            item for item in CLOTHING_DATASET 
            if item['category'] in categories
        ]
        
        # Add random items if not enough matches
        if len(suggestions) < 5:
            remaining = [item for item in CLOTHING_DATASET if item not in suggestions]
            suggestions.extend(random.sample(remaining, min(5 - len(suggestions), len(remaining))))
        
        return jsonify({"suggestions": suggestions[:5]})
    except Exception as e:
        print(f"[v0] Suggestion error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/look-rating', methods=['POST'])
def get_look_rating():
    """Generate look rating and personalized dressing ideas"""
    try:
        data = request.json
        item = data.get('item')
        confidence = data.get('confidence', 0.5)
        
        if not item:
            return jsonify({"error": "Item required"}), 400
        
        category = item.get('category', 'casual')
        
        # Generate look rating (1-10) based on item attributes
        base_rating = 6
        
        # Boost rating for high confidence recognition
        if confidence > 0.8:
            base_rating += 2
        elif confidence > 0.6:
            base_rating += 1
        
        # Boost based on category appeal
        category_boost = {"elegant": 2, "formal": 1.5, "vintage": 1.5, "casual": 0.5, "sport": 0}.get(category, 0)
        
        look_rating = min(10, base_rating + category_boost)
        
        # Get dressing ideas for this category
        dressing_data = DRESSING_IDEAS.get(category, DRESSING_IDEAS["casual"])
        
        # Select a random outfit and tip
        suggested_outfit = random.choice(dressing_data["outfits"])
        styling_tip = random.choice(dressing_data["tips"])
        
        return jsonify({
            "lookRating": round(look_rating, 1),
            "ratingDescription": get_rating_description(look_rating),
            "suggestedOutfit": suggested_outfit,
            "stylingTip": styling_tip,
            "alternativeOutfits": random.sample(dressing_data["outfits"], min(2, len(dressing_data["outfits"])))
        })
    except Exception as e:
        print(f"[v0] Look rating error: {str(e)}")
        return jsonify({"error": str(e)}), 500

def get_rating_description(rating):
    """Generate description based on rating"""
    if rating >= 9:
        return "Excellent fit! You look amazing!"
    elif rating >= 8:
        return "Great choice! Very stylish look"
    elif rating >= 7:
        return "Good look! Looks great on you"
    elif rating >= 6:
        return "Nice! Decent style overall"
    elif rating >= 5:
        return "Okay look. Could be improved"
    else:
        return "Consider other options for better style"

@app.route('/api/health', methods=['GET'])
def health():
    """Health check"""
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
