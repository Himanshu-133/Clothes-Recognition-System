'use client'

import { useMemo } from 'react'
import { clothingDataset } from '@/lib/clothing-dataset'
import { Badge } from '@/components/ui/badge'
import { Star, Lightbulb } from 'lucide-react'

interface SuggestionsPanelProps {
  ratings: Record<string, number>
}

export function SuggestionsPanel({ ratings }: SuggestionsPanelProps) {
  const suggestions = useMemo(() => {
    const ratedItems = Object.entries(ratings)
      .filter(([_, rating]) => rating >= 4)
      .map(([id]) => clothingDataset.find(c => c.id === id))
      .filter(Boolean)

    if (ratedItems.length === 0) {
      return []
    }

    // Extract attributes from highly-rated items
    const preferredCategories = new Set(ratedItems.map(item => item?.category))
    const preferredColors = new Set(ratedItems.map(item => item?.color))
    const preferredStyles = new Set(ratedItems.map(item => item?.style))
    const preferredSeasons = new Set(ratedItems.map(item => item?.season))

    // Find suggestions matching attributes
    const suggested = clothingDataset.filter(item => {
      const alreadyRated = Object.keys(ratings).includes(item.id)
      if (alreadyRated) return false

      const matchesCategory = preferredCategories.has(item.category)
      const matchesColor = preferredColors.has(item.color)
      const matchesStyle = preferredStyles.has(item.style)
      const matchesSeason = preferredSeasons.has(item.season)

      // Item should match at least 2-3 attributes
      const matchCount = [matchesCategory, matchesColor, matchesStyle, matchesSeason].filter(Boolean).length
      return matchCount >= 2
    })

    return suggested.slice(0, 5)
  }, [ratings])

  const ratedCount = Object.values(ratings).filter(r => r > 0).length

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        <h2 className="text-xl font-bold text-slate-900">Suggestions For You</h2>
      </div>

      {ratedCount === 0 ? (
        <p className="text-center text-slate-500 py-8">
          Rate items to get personalized suggestions!
        </p>
      ) : suggestions.length === 0 ? (
        <p className="text-center text-slate-500 py-8">
          No suggestions yet. Rate more items!
        </p>
      ) : (
        <div className="space-y-3">
          {suggestions.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
            >
              <p className="font-semibold text-slate-900">{item.name}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                <Badge variant="outline" className="text-xs">{item.color}</Badge>
                <Badge variant="outline" className="text-xs">{item.style}</Badge>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Matches your taste in <span className="font-semibold">{item.category}</span> and <span className="font-semibold">{item.style}</span> style
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-3 bg-slate-50 rounded-lg">
        <p className="text-xs text-slate-600">
          <span className="font-semibold">💡 Tip:</span> Rate more items (especially with high ratings) to unlock better suggestions!
        </p>
      </div>
    </div>
  )
}
