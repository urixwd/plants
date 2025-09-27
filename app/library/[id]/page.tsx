'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PlantsSDK } from '@/lib/sdk/plants'
import type { Plant } from '@/db/types/plants.types'

export default function PlantProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [plant, setPlant] = useState<Plant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPlant() {
      try {
        const id = params.id as string
        const plantData = await PlantsSDK.getById(id)
        if (plantData) {
          setPlant(plantData)
        } else {
          setError('Plant not found')
        }
      } catch (error) {
        console.error('Error loading plant:', error)
        setError('Failed to load plant details')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      loadPlant()
    }
  }, [params.id])

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
          <p className="text-earth-600">Loading plant details...</p>
        </div>
      </div>
    )
  }

  if (error || !plant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <p className="text-red-600">{error || 'Plant not found'}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-primary-800">
            {plant.englishName}
          </h1>
          <p className="text-xl italic text-earth-600">
            {plant.scientificName}
          </p>
          {plant.spanishName && (
            <p className="text-earth-500">Spanish: {plant.spanishName}</p>
          )}
          {plant.hebrewName && (
            <p className="text-earth-500">Hebrew: {plant.hebrewName}</p>
          )}
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => router.back()}>
            ← Back
          </Button>
          <Button onClick={() => router.push(`/plants/new?plantId=${plant.id}`)}>
            Add to My Collection
          </Button>
        </div>
      </div>

      {/* Care Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🌱</span>
            <span>Care Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-primary-700 mb-2">Difficulty Level</h3>
                <Badge variant={getDifficultyColor(plant.careDifficulty || 'medium')} className="text-sm">
                  {plant.careDifficulty || 'medium'} care
                </Badge>
              </div>

              {plant.recommendedLight && (
                <div>
                  <h3 className="font-semibold text-primary-700 mb-2">☀️ Light Requirements</h3>
                  <p className="text-earth-700">{plant.recommendedLight}</p>
                </div>
              )}

              {plant.recommendedWatering && (
                <div>
                  <h3 className="font-semibold text-primary-700 mb-2">💧 Watering</h3>
                  <p className="text-earth-700">{plant.recommendedWatering}</p>
                </div>
              )}

              {plant.recommendedWaterAmount && (
                <div>
                  <h3 className="font-semibold text-primary-700 mb-2">💧 Water Amount</h3>
                  <p className="text-earth-700">{plant.recommendedWaterAmount}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {plant.recommendedSoil && (
                <div>
                  <h3 className="font-semibold text-primary-700 mb-2">🪨 Soil</h3>
                  <p className="text-earth-700">{plant.recommendedSoil}</p>
                </div>
              )}

              {plant.recommendedSoilAiriness && (
                <div>
                  <h3 className="font-semibold text-primary-700 mb-2">💨 Soil Airiness</h3>
                  <p className="text-earth-700">{plant.recommendedSoilAiriness}</p>
                </div>
              )}

              {plant.recommendedSoilPh && (
                <div>
                  <h3 className="font-semibold text-primary-700 mb-2">⚗️ Soil pH</h3>
                  <p className="text-earth-700">{plant.recommendedSoilPh}</p>
                </div>
              )}

              {plant.recommendedSoilMoisture && (
                <div>
                  <h3 className="font-semibold text-primary-700 mb-2">💧 Soil Moisture</h3>
                  <p className="text-earth-700">{plant.recommendedSoilMoisture}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feeding & Care */}
      {(plant.recommendedFertilizer || plant.recommendedFlowering) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🌿</span>
              <span>Feeding & Growth</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {plant.recommendedFertilizer && (
                <div>
                  <h3 className="font-semibold text-primary-700 mb-2">🌱 Fertilizer</h3>
                  <p className="text-earth-700">{plant.recommendedFertilizer}</p>
                </div>
              )}

              {plant.recommendedFlowering && (
                <div>
                  <h3 className="font-semibold text-primary-700 mb-2">🌸 Flowering</h3>
                  <p className="text-earth-700">{plant.recommendedFlowering}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Notes */}
      {plant.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📝</span>
              <span>Additional Notes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-earth-700">{plant.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-primary-50 border-primary-200">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-primary-700 mb-2">Add to Your Collection</h3>
            <p className="text-earth-600 mb-4">Track this plant in your personal garden</p>
            <Button
              className="w-full"
              onClick={() => router.push(`/plants/new?plantId=${plant.id}`)}
            >
              Add Plant Instance
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-earth-50 border-earth-200">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-earth-700 mb-2">More Plants</h3>
            <p className="text-earth-600 mb-4">Discover similar plants for your collection</p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/library')}
            >
              Browse Library
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}