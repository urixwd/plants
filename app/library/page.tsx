'use client'

import { useEffect, useState } from 'react'
import { PlantSearch } from '@/components/library/plant-search'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PlantsSDK } from '@/lib/sdk/plants'
import type { Plant } from '@/db/types/plants.types'

export default function LibraryPage() {
  const [recentPlants, setRecentPlants] = useState<Plant[]>([])
  const [popularPlants, setPopularPlants] = useState<Plant[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadPlants() {
      try {
        const all = await PlantsSDK.getAll()

        // Get some popular easy-care plants
        const popular = all.filter(p => p.careDifficulty === 'easy').slice(0, 6)
        setPopularPlants(popular)

        // Get recent additions (last 8)
        setRecentPlants(all.slice(-8))
      } catch (error) {
        console.error('Error loading plants:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPlants()
  }, [])

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
          <p className="text-earth-600">Loading plant library...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary-800">
          🌿 Plant Library
        </h1>
        <p className="text-xl text-earth-600">
          Discover and learn about different plants for your collection
        </p>
      </div>

      {/* Search Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary-700">Search Plants</h2>
        <PlantSearch showAddButton={true} />
      </section>

      {/* Popular Plants */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-primary-700">Easy Care Plants</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularPlants.map((plant) => (
            <Card key={plant.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{plant.englishName}</CardTitle>
                <p className="text-sm italic text-earth-600">{plant.scientificName}</p>
              </CardHeader>
              <CardContent className="space-y-3">
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

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.open(`/library/${plant.id}`, '_self')}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Browse All */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-primary-700">Recently Added</h2>
          <Button variant="outline" onClick={() => window.open('/library/browse', '_self')}>
            Browse All Plants
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentPlants.map((plant) => (
            <Card key={plant.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-primary-800">{plant.englishName}</h3>
                  <p className="text-xs italic text-earth-500">{plant.scientificName}</p>
                  <Badge
                    variant={getDifficultyColor(plant.careDifficulty || 'medium')}
                    className="text-xs"
                  >
                    {plant.careDifficulty}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}