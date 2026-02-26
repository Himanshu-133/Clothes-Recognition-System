// State Management
const state = {
    currentImage: null,
    recognizedItem: null,
    ratings: [],
    selectedRating: 0,
    suggestions: []
};

// Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const cameraInput = document.getElementById('cameraInput');
const uploadBtn = document.getElementById('uploadBtn');
const cameraBtn = document.getElementById('cameraBtn');
const previewContainer = document.getElementById('previewContainer');
const previewImage = document.getElementById('previewImage');
const clearImageBtn = document.getElementById('clearImageBtn');
const recognitionResult = document.getElementById('recognitionResult');
const loadingSpinner = document.getElementById('loadingSpinner');
const starRating = document.getElementById('starRating');
const ratingText = document.getElementById('ratingText');
const submitRatingBtn = document.getElementById('submitRatingBtn');
const suggestionsContainer = document.getElementById('suggestionsContainer');
const historyList = document.getElementById('historyList');
const lookRatingContainer = document.getElementById('lookRatingContainer');

// Event Listeners
uploadBtn.addEventListener('click', () => fileInput.click());
cameraBtn.addEventListener('click', () => cameraInput.click());
fileInput.addEventListener('change', handleFileSelect);
cameraInput.addEventListener('change', handleFileSelect);
clearImageBtn.addEventListener('click', clearImage);
submitRatingBtn.addEventListener('click', submitRating);
uploadArea.addEventListener('dragover', handleDragOver);
uploadArea.addEventListener('dragleave', handleDragLeave);
uploadArea.addEventListener('drop', handleDrop);

// Star rating event delegation
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('star')) {
        selectRating(parseInt(e.target.dataset.value));
    }
});

// Handle File Selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            state.currentImage = e.target.result;
            displayPreview(e.target.result);
            recognizeClothing(e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

// Handle Drag & Drop
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragging');
}

function handleDragLeave() {
    uploadArea.classList.remove('dragging');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragging');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        fileInput.files = e.dataTransfer.files;
        handleFileSelect({ target: fileInput });
    }
}

// Display Preview
function displayPreview(imageData) {
    previewImage.src = imageData;
    previewContainer.classList.remove('hidden');
    recognitionResult.classList.add('hidden');
}

// Clear Image
function clearImage() {
    state.currentImage = null;
    state.recognizedItem = null;
    state.selectedRating = 0;
    previewContainer.classList.add('hidden');
    recognitionResult.classList.add('hidden');
    loadingSpinner.classList.add('hidden');
    fileInput.value = '';
    cameraInput.value = '';
    updateStarDisplay();
    lookRatingContainer.classList.add('hidden');
}

// Recognize Clothing (AI via Backend)
async function recognizeClothing(imageData) {
    loadingSpinner.classList.remove('hidden');
    recognitionResult.classList.add('hidden');
    
    try {
        const response = await fetch('http://localhost:5000/api/recognize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: imageData })
        });
        
        if (!response.ok) throw new Error('Recognition failed');
        
        const data = await response.json();
        state.recognizedItem = data;
        
        displayRecognitionResult(data);
        await getLookRating(data);
    } catch (error) {
        console.error('[v0] Recognition error:', error);
        loadingSpinner.classList.add('hidden');
        alert('Error recognizing clothing. Please try again.');
    }
}

async function getLookRating(item) {
    try {
        const response = await fetch('http://localhost:5000/api/look-rating', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                item: item,
                confidence: item.confidence
            })
        });
        
        if (!response.ok) throw new Error('Failed to get look rating');
        
        const ratingData = await response.json();
        displayLookRating(ratingData);
    } catch (error) {
        console.error('[v0] Look rating error:', error);
    }
}

function displayLookRating(ratingData) {
    const container = document.getElementById('lookRatingContainer');
    
    const outfitItems = ratingData.suggestedOutfit.items.join(', ');
    const alternativeOutfits = ratingData.alternativeOutfits
        .map(o => `<li>${o.items.join(', ')} - ${o.occasion}</li>`)
        .join('');
    
    container.innerHTML = `
        <div class="look-rating-section">
            <h3>How You Look</h3>
            <div class="rating-score">
                <span class="score">${ratingData.lookRating}/10</span>
                <span class="description">${ratingData.ratingDescription}</span>
            </div>
            
            <div class="styling-advice">
                <h4>Suggested Outfit</h4>
                <p class="outfit">${outfitItems}</p>
                <p class="occasion">Occasion: ${ratingData.suggestedOutfit.occasion}</p>
                
                <h4>Styling Tip</h4>
                <p class="tip">${ratingData.stylingTip}</p>
                
                <h4>Alternative Combinations</h4>
                <ul class="alternatives">
                    ${alternativeOutfits}
                </ul>
            </div>
        </div>
    `;
    
    container.classList.remove('hidden');
}

// Display Recognition Result
function displayRecognitionResult(item) {
    document.getElementById('itemName').textContent = item.name;
    document.getElementById('itemCategory').textContent = `Category: ${item.category}`;
    document.getElementById('itemMatch').textContent = `Match: ${Math.round(item.confidence * 100)}%`;
    
    loadingSpinner.classList.add('hidden');
    recognitionResult.classList.remove('hidden');
}

// Select Rating
function selectRating(value) {
    state.selectedRating = value;
    updateStarDisplay();
    ratingText.textContent = `You rated: ${value} ${value === 1 ? 'star' : 'stars'}`;
    submitRatingBtn.disabled = false;
}

// Update Star Display
function updateStarDisplay() {
    document.querySelectorAll('.star').forEach((star, index) => {
        if (index < state.selectedRating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Submit Rating
function submitRating() {
    if (state.recognizedItem && state.selectedRating > 0) {
        const ratingEntry = {
            item: state.recognizedItem.name,
            category: state.recognizedItem.category,
            rating: state.selectedRating,
            timestamp: new Date().toLocaleTimeString()
        };
        
        state.ratings.push(ratingEntry);
        updateHistoryDisplay();
        generateSuggestions();
        
        alert(`Rated "${state.recognizedItem.name}" with ${state.selectedRating} stars!`);
        clearImage();
    }
}

// Generate Suggestions
function generateSuggestions() {
    if (state.ratings.length === 0) {
        suggestionsContainer.innerHTML = '<p class="empty-message">Rate some items to get personalized suggestions</p>';
        return;
    }
    
    // Get highly rated categories
    const highRatedCategories = state.ratings
        .filter(r => r.rating >= 4)
        .map(r => r.category);
    
    if (highRatedCategories.length === 0) {
        suggestionsContainer.innerHTML = '<p class="empty-message">Rate items 4+ stars to get personalized suggestions</p>';
        return;
    }
    
    // Fetch suggestions from backend
    fetch('http://localhost:5000/api/suggestions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ categories: highRatedCategories })
    })
    .then(res => res.json())
    .then(data => {
        displaySuggestions(data.suggestions);
    })
    .catch(error => console.error('[v0] Suggestion error:', error));
}

// Display Suggestions
function displaySuggestions(suggestions) {
    suggestionsContainer.innerHTML = '';
    suggestions.forEach(item => {
        const card = document.createElement('div');
        card.className = 'suggestion-card';
        card.innerHTML = `
            <h4>${item.name}</h4>
            <p>${item.category}</p>
            <p style="margin-top: 8px; font-size: 0.75rem; color: #059669;">Recommended</p>
        `;
        suggestionsContainer.appendChild(card);
    });
}

// Update History Display
function updateHistoryDisplay() {
    if (state.ratings.length === 0) {
        historyList.innerHTML = '<p class="empty-message">No items rated yet</p>';
        return;
    }
    
    historyList.innerHTML = '';
    state.ratings.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
            <span>${entry.rating}★</span>
            ${entry.item}
        `;
        historyList.appendChild(item);
    });
}

// Initialize
console.log('[v0] App initialized - waiting for image upload');
