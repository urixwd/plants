'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { PlantsSDK } from '@/lib/sdk/plants'
import type { Plant } from '@/db/types/plants.types'

export default function BrowsePlantsPage() {
  const [plants, setPlants] = useState<Plant[]>([])
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('all')

  useEffect(() => {
    async function loadPlants() {
      try {
        console.log('🌱 Starting to load plants...')
        const allPlants = await PlantsSDK.getAll()
        console.log('🌱 Plants loaded:', allPlants.length, 'plants')
        console.log('🌱 First plant:', allPlants[0])
        setPlants(allPlants)
        setFilteredPlants(allPlants)
      } catch (error) {
        console.error('❌ Error loading plants:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPlants()
  }, [])

  useEffect(() => {
    let filtered = plants

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(plant =>
        plant.englishName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.scientificName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.spanishName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by difficulty
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(plant => plant.careDifficulty === difficultyFilter)
    }

    setFilteredPlants(filtered)
  }, [plants, searchQuery, difficultyFilter])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success'
      case 'medium': return 'warning'
      case 'hard': return 'destructive'
      default: return 'secondary'
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-earth-600">Loading all plants...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary-800">
          🌿 Browse All Plants
        </h1>
        <p className="text-xl text-earth-600">
          {plants.length} plants available in our library
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">
                Search Plants
              </label>
              <Input
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">
                Care Difficulty
              </label>
              <Select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy Care</option>
                <option value="medium">Medium Care</option>
                <option value="hard">Hard Care</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-earth-600">
          Showing {filteredPlants.length} of {plants.length} plants
        </p>
        <Button variant="outline" onClick={() => window.history.back()}>
          ← Back to Library
        </Button>
      </div>

      {/* Plants Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlants.map((plant) => (
          <Card key={plant.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{plant.englishName}</CardTitle>
              <p className="text-sm italic text-earth-600">{plant.scientificName}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Names */}
              <div className="space-y-1">
                {plant.spanishName && (
                  <p className="text-xs text-earth-500">Spanish: {plant.spanishName}</p>
                )}
                {plant.hebrewName && (
                  <p className="text-xs text-earth-500">Hebrew: {plant.hebrewName}</p>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant={getDifficultyColor(plant.careDifficulty || 'medium')}>
                  {plant.careDifficulty} care
                </Badge>
                {plant.recommendedLight && (
                  <Badge variant="outline" className="text-xs">
                    {plant.recommendedLight.length > 15
                      ? plant.recommendedLight.substring(0, 15) + '...'
                      : plant.recommendedLight}
                  </Badge>
                )}
              </div>

              {/* Quick Info */}
              <div className="space-y-2 text-sm">
                {plant.recommendedWatering && (
                  <p className="text-earth-600 line-clamp-2">
                    💧 {plant.recommendedWatering}
                  </p>
                )}
                {plant.recommendedSoil && (
                  <p className="text-earth-600 line-clamp-2">
                    🪨 {plant.recommendedSoil}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => window.open(`/library/${plant.id}`, '_self')}
                >
                  View Details
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => window.open(`/plants/new?plantId=${plant.id}`, '_self')}
                >
                  Add to Collection
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No results */}
      {filteredPlants.length === 0 && !isLoading && (
        <div className="text-center py-12 text-earth-600">
          <p className="text-lg">No plants found matching your criteria</p>
          <p className="text-sm mt-2">Try adjusting your search or filter settings</p>
        </div>
      )}
    </div>
  )
}