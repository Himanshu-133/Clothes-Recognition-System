export interface ClothingItem {
  id: string
  name: string
  category: 'formal' | 'casual' | 'sport' | 'vintage' | 'elegant'
  color: string
  style: 'minimal' | 'bold' | 'classic' | 'trendy'
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'all-season'
  priceRange: 'budget' | 'mid' | 'premium'
}

export const clothingDataset: ClothingItem[] = [
  // Formal
  { id: '1', name: 'Business Suit', category: 'formal', color: 'navy', style: 'classic', season: 'all-season', priceRange: 'premium' },
  { id: '2', name: 'Dress Shirt', category: 'formal', color: 'white', style: 'classic', season: 'all-season', priceRange: 'mid' },
  { id: '3', name: 'Blazer', category: 'formal', color: 'black', style: 'classic', season: 'all-season', priceRange: 'premium' },
  { id: '4', name: 'Tuxedo', category: 'formal', color: 'black', style: 'classic', season: 'all-season', priceRange: 'premium' },
  
  // Casual
  { id: '5', name: 'Jeans', category: 'casual', color: 'blue', style: 'classic', season: 'all-season', priceRange: 'mid' },
  { id: '6', name: 'T-Shirt', category: 'casual', color: 'white', style: 'minimal', season: 'all-season', priceRange: 'budget' },
  { id: '7', name: 'Polo Shirt', category: 'casual', color: 'green', style: 'classic', season: 'summer', priceRange: 'mid' },
  { id: '8', name: 'Cargo Pants', category: 'casual', color: 'khaki', style: 'bold', season: 'summer', priceRange: 'mid' },
  { id: '9', name: 'Hoodie', category: 'casual', color: 'gray', style: 'minimal', season: 'winter', priceRange: 'budget' },
  { id: '10', name: 'Denim Jacket', category: 'casual', color: 'blue', style: 'classic', season: 'fall', priceRange: 'mid' },
  
  // Sport
  { id: '11', name: 'Running Shoes', category: 'sport', color: 'black', style: 'trendy', season: 'all-season', priceRange: 'mid' },
  { id: '12', name: 'Athletic Shorts', category: 'sport', color: 'blue', style: 'minimal', season: 'summer', priceRange: 'mid' },
  { id: '13', name: 'Gym Tank Top', category: 'sport', color: 'white', style: 'minimal', season: 'all-season', priceRange: 'budget' },
  { id: '14', name: 'Sports Bra', category: 'sport', color: 'black', style: 'minimal', season: 'all-season', priceRange: 'mid' },
  { id: '15', name: 'Yoga Pants', category: 'sport', color: 'black', style: 'minimal', season: 'all-season', priceRange: 'mid' },
  
  // Vintage
  { id: '16', name: 'Vintage Leather Jacket', category: 'vintage', color: 'brown', style: 'bold', season: 'fall', priceRange: 'premium' },
  { id: '17', name: 'Retro Band Tee', category: 'vintage', color: 'black', style: 'bold', season: 'all-season', priceRange: 'budget' },
  { id: '18', name: 'Bell Bottom Jeans', category: 'vintage', color: 'blue', style: 'trendy', season: 'all-season', priceRange: 'mid' },
  { id: '19', name: 'Vintage Cardigan', category: 'vintage', color: 'cream', style: 'classic', season: 'fall', priceRange: 'mid' },
  
  // Elegant
  { id: '20', name: 'Evening Gown', category: 'elegant', color: 'red', style: 'bold', season: 'all-season', priceRange: 'premium' },
  { id: '21', name: 'Silk Blouse', category: 'elegant', color: 'champagne', style: 'classic', season: 'all-season', priceRange: 'premium' },
  { id: '22', name: 'Pearl Necklace', category: 'elegant', color: 'white', style: 'classic', season: 'all-season', priceRange: 'premium' },
  { id: '23', name: 'High Heels', category: 'elegant', color: 'black', style: 'bold', season: 'all-season', priceRange: 'premium' },
  { id: '24', name: 'Cocktail Dress', category: 'elegant', color: 'black', style: 'minimal', season: 'all-season', priceRange: 'premium' },
  
  // Additional variety
  { id: '25', name: 'Floral Sundress', category: 'casual', color: 'multicolor', style: 'trendy', season: 'summer', priceRange: 'mid' },
  { id: '26', name: 'Winter Coat', category: 'casual', color: 'black', style: 'classic', season: 'winter', priceRange: 'premium' },
  { id: '27', name: 'Sneakers', category: 'casual', color: 'white', style: 'minimal', season: 'all-season', priceRange: 'mid' },
  { id: '28', name: 'Chinos', category: 'casual', color: 'tan', style: 'classic', season: 'spring', priceRange: 'mid' },
  { id: '29', name: 'Leather Belt', category: 'formal', color: 'black', style: 'classic', season: 'all-season', priceRange: 'mid' },
  { id: '30', name: 'Scarf', category: 'elegant', color: 'burgundy', style: 'bold', season: 'fall', priceRange: 'mid' },
]
