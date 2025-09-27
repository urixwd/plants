'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { PlantInstancesSDK, CareEventsSDK } from '@/lib/sdk'
import type { PlantInstanceWithPlant } from '@/lib/sdk'

export default function PlantDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [plant, setPlant] = useState<PlantInstanceWithPlant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isWatering, setIsWatering] = useState(false)

  useEffect(() => {
    loadPlant()
  }, [params.id])

  const loadPlant = async () => {
    try {
      if (typeof params.id === 'string') {
        const data = await PlantInstancesSDK.getById(params.id)
        if (data) {
          setPlant(data)
        } else {
          setError('Plant not found')
        }
      }
    } catch (err) {
      setError('Failed to load plant details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickWater = async () => {
    if (!plant || isWatering) return

    setIsWatering(true)
    try {
      await CareEventsSDK.log(plant.id, {
        type: 'water',
        notes: 'Quick water from plant details'
      })
      // Optionally reload plant data to show updated info
      await loadPlant()
    } catch (error) {
      console.error('Failed to log watering:', error)
    } finally {
      setIsWatering(false)
    }
  }

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'success'
      case 'struggling': return 'warning'
      case 'sick': return 'destructive'
      case 'dead': return 'secondary'
      default: return 'secondary'
    }
  }

  const getPlantEmoji = () => {
    if (!plant?.plant.englishName) return '🪴'
    const name = plant.plant.englishName.toLowerCase()
    if (name.includes('monstera')) return '🌿'
    if (name.includes('snake')) return '🐍'
    if (name.includes('fiddle')) return '🎻'
    if (name.includes('rubber')) return '🌳'
    return '🪴'
  }

  const formatLocation = (location: string) => {
    return location.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
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
          <Button onClick={() => router.push('/plants')}>
            ← Back to My Plants
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push('/plants')}>
          ← Back to My Plants
        </Button>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleQuickWater}
            disabled={isWatering}
          >
            💧 {isWatering ? 'Watering...' : 'Water Now'}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/plants/${plant.id}/photos`)}
          >
            📷 Photos
          </Button>
        </div>
      </div>

      {/* Plant Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="text-2xl">
                  {getPlantEmoji()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {plant.nickname || plant.plant.englishName || 'Unknown Plant'}
                </CardTitle>
                <p className="text-lg italic text-earth-600">
                  {plant.plant.scientificName}
                </p>
                {plant.plant.spanishName && (
                  <p className="text-sm text-earth-500">
                    Spanish: {plant.plant.spanishName}
                  </p>
                )}
                {plant.plant.hebrewName && (
                  <p className="text-sm text-earth-500">
                    Hebrew: {plant.plant.hebrewName}
                  </p>
                )}
              </div>
            </div>
            <Badge variant={getHealthColor(plant.healthStatus || 'healthy')} className="text-lg px-3 py-1">
              {plant.healthStatus || 'healthy'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Plant Details Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-earth-600">Location:</span>
              <span className="font-medium">{formatLocation(plant.location)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-earth-600">Pot size:</span>
              <Badge variant="outline">{plant.potSize?.toUpperCase()}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-earth-600">Sun conditions:</span>
              <span className="font-medium">
                {plant.sunType} ({plant.sunStrength}/5)
              </span>
            </div>
            {plant.acquisitionDate && (
              <div className="flex justify-between items-center">
                <span className="text-earth-600">Acquired:</span>
                <span className="font-medium">
                  {new Date(plant.acquisitionDate).toLocaleDateString()}
                </span>
              </div>
            )}
            {plant.acquisitionSource && (
              <div className="flex justify-between items-center">
                <span className="text-earth-600">Source:</span>
                <span className="font-medium">{plant.acquisitionSource}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Care Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Care Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {plant.plant.careDifficulty && (
              <div className="flex justify-between items-center">
                <span className="text-earth-600">Difficulty:</span>
                <Badge variant="outline">{plant.plant.careDifficulty} care</Badge>
              </div>
            )}
            {plant.plant.recommendedLight && (
              <div className="space-y-1">
                <span className="text-earth-600 text-sm">Light:</span>
                <p className="text-sm">{plant.plant.recommendedLight}</p>
              </div>
            )}
            {plant.plant.recommendedWatering && (
              <div className="space-y-1">
                <span className="text-earth-600 text-sm">Watering:</span>
                <p className="text-sm">{plant.plant.recommendedWatering}</p>
              </div>
            )}
            {plant.plant.recommendedSoil && (
              <div className="space-y-1">
                <span className="text-earth-600 text-sm">Soil:</span>
                <p className="text-sm">{plant.plant.recommendedSoil}</p>
              </div>
            )}
            {plant.plant.recommendedFertilizer && (
              <div className="space-y-1">
                <span className="text-earth-600 text-sm">Fertilizer:</span>
                <p className="text-sm">{plant.plant.recommendedFertilizer}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {plant.notes && (
        <Card>
          <CardHeader>
            <CardTitle>My Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-earth-700">{plant.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              onClick={handleQuickWater}
              disabled={isWatering}
              className="flex flex-col items-center space-y-2 h-auto py-4"
            >
              <span className="text-2xl">💧</span>
              <span>{isWatering ? 'Watering...' : 'Water'}</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/plants/${plant.id}/photos`)}
              className="flex flex-col items-center space-y-2 h-auto py-4"
            >
              <span className="text-2xl">📷</span>
              <span>Photos</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // TODO: Implement care log
                alert('Care log feature coming soon!')
              }}
              className="flex flex-col items-center space-y-2 h-auto py-4"
            >
              <span className="text-2xl">📝</span>
              <span>Care Log</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // TODO: Implement edit functionality
                alert('Edit feature coming soon!')
              }}
              className="flex flex-col items-center space-y-2 h-auto py-4"
            >
              <span className="text-2xl">✏️</span>
              <span>Edit</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}