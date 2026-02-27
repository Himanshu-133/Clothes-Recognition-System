'use client'

import { clothingDataset, ClothingItem } from '@/lib/clothing-dataset'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'

interface ClothingBrowserProps {
  onSelect: (id: string) => void
  ratings: Record<string, number>
}

export function ClothingBrowser({ onSelect, ratings }: ClothingBrowserProps) {
  const ratedCount = Object.keys(ratings).length

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-900">Browse Clothes</h2>
        <p className="text-sm text-slate-500 mt-1">Rated: {ratedCount}/30</p>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {clothingDataset.map((item) => (
          <Button
            key={item.id}
            onClick={() => onSelect(item.id)}
            variant="outline"
            className="w-full justify-between h-auto p-3 text-left"
          >
            <div>
              <p className="font-medium text-slate-900">{item.name}</p>
              <div className="flex gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                <Badge variant="outline" className="text-xs">{item.color}</Badge>
              </div>
            </div>
            {ratings[item.id] && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold">{ratings[item.id]}</span>
              </div>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}
