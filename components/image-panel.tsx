'use client'

import { useState } from 'react'
import { clothingDataset } from '@/lib/clothing-dataset'
import { Button } from '@/components/ui/button'
import { Star, X } from 'lucide-react'

interface RatingPanelProps {
  clothingId: string | null
  ratings: Record<string, number>
  onRate: (id: string, rating: number) => void
  recognizedImage?: string | null
}

export function RatingPanel({ clothingId, ratings, onRate, recognizedImage }: RatingPanelProps) {
  const [hoveredRating, setHoveredRating] = useState(0)
  
  const item = clothingId ? clothingDataset.find(c => c.id === clothingId) : null
  const currentRating = clothingId ? (ratings[clothingId] || 0) : 0

  if (!item) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-center text-slate-500">Select a clothing item to rate</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Rate This Item</h2>
      
      {recognizedImage && (
        <div className="mb-4 relative">
          <img 
            src={recognizedImage || "/placeholder.svg"} 
            alt="Recognized clothing" 
            className="w-full h-32 object-cover rounded-lg"
          />
          <p className="text-xs text-slate-500 mt-1 text-center">Recognized from your photo</p>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{item.name}</h3>
        <div className="space-y-2 text-sm">
          <p><span className="font-semibold text-slate-700">Category:</span> {item.category}</p>
          <p><span className="font-semibold text-slate-700">Color:</span> {item.color}</p>
          <p><span className="font-semibold text-slate-700">Style:</span> {item.style}</p>
          <p><span className="font-semibold text-slate-700">Season:</span> {item.season}</p>
          <p><span className="font-semibold text-slate-700">Price:</span> {item.priceRange}</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm font-semibold text-slate-700 mb-3">Rate this clothing:</p>
        <div className="flex gap-3 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => onRate(item.id, star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoveredRating || currentRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-slate-300'
                }`}
              />
            </button>
          ))}
        </div>
        {currentRating > 0 && (
          <p className="text-center mt-3 text-sm font-semibold text-slate-700">
            Your rating: {currentRating}/5
          </p>
        )}
      </div>

      <Button 
        onClick={() => onRate(item.id, 0)} 
        variant="outline"
        className="w-full"
      >
        Clear Rating
      </Button>
    </div>
  )
}
