'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PlantsSDK } from '@/lib/sdk/plants'
import type { Plant } from '@/db/types/plants.types'

interface PlantSearchProps {
  onSelectPlant?: (plant: Plant) => void
  showAddButton?: boolean
}

export function PlantSearch({ onSelectPlant, showAddButton = false }: PlantSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<Plant[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const plants = await PlantsSDK.search(searchQuery)
      setResults(plants)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success'
      case 'medium': return 'warning'
      case 'hard': return 'destructive'
      default: return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="flex space-x-2">
        <Input
          placeholder="Search plants by name (e.g. Pothos, Monstera, Basil)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary-700">
            Found {results.length} plant{results.length !== 1 ? 's' : ''}
          </h3>
          <div className="grid gap-4">
            {results.map((plant) => (
              <Card key={plant.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div>
                        <h4 className="font-semibold text-primary-800">
                          {plant.englishName}
                        </h4>
                        <p className="text-sm italic text-earth-600">
                          {plant.scientificName}
                        </p>
                        {plant.spanishName && (
                          <p className="text-sm text-earth-500">
                            Spanish: {plant.spanishName}
                          </p>
                        )}
                        {plant.hebrewName && (
                          <p className="text-sm text-earth-500">
                            Hebrew: {plant.hebrewName}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant={getDifficultyColor(plant.careDifficulty || 'medium')}>
                          {plant.careDifficulty} care
                        </Badge>
                        {plant.recommendedLight && (
                          <Badge variant="outline">
                            {plant.recommendedLight}
                          </Badge>
                        )}
                      </div>

                      {plant.recommendedWatering && (
                        <p className="text-sm text-earth-600">
                          💧 {plant.recommendedWatering}
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/library/${plant.id}`, '_blank')}
                      >
                        View Details
                      </Button>
                      {showAddButton && onSelectPlant && (
                        <Button
                          size="sm"
                          onClick={() => onSelectPlant(plant)}
                        >
                          Add to Collection
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No results message */}
      {searchQuery && !isLoading && results.length === 0 && (
        <div className="text-center py-8 text-earth-600">
          <p>No plants found for "{searchQuery}"</p>
          <p className="text-sm mt-2">Try searching for common names like "Pothos", "Snake Plant", or "Basil"</p>
        </div>
      )}
    </div>
  )
}