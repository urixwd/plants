'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlantCard } from '@/components/plants/plant-card'
import { Button } from '@/components/ui/button'
import { PlantInstancesSDK } from '@/lib/sdk'
import type { PlantInstanceWithPlant } from '@/lib/sdk'

export default function PlantsPage() {
  const [plants, setPlants] = useState<PlantInstanceWithPlant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPlants()
  }, [])

  const loadPlants = async () => {
    try {
      const data = await PlantInstancesSDK.getAll()
      setPlants(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load plants')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickWater = (plantInstanceId: string) => {
    // Refresh the plant data to show updated last watering
    loadPlants()
  }

  const handleViewDetails = (plantInstanceId: string) => {
    // Navigate to plant details page
    window.location.href = `/plants/${plantInstanceId}`
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-earth-600">Loading your plants...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <p className="text-red-600">Error: {error}</p>
          <Button onClick={loadPlants} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary-800">
            🌱 Your Plants
          </h1>
          <p className="text-xl text-earth-600 mt-2">
            {plants.length} plants in your collection
          </p>
        </div>
        <Link href="/plants/new">
          <Button size="lg">
            Add New Plant
          </Button>
        </Link>
      </div>

      {/* Plants Grid */}
      {plants.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <div className="text-6xl">🪴</div>
          <h2 className="text-2xl font-semibold text-earth-700">
            No plants yet!
          </h2>
          <p className="text-earth-600">
            Start building your plant collection by adding your first plant.
          </p>
          <Link href="/plants/new">
            <Button size="lg" className="mt-4">
              Add Your First Plant
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plants.map((plant) => (
            <PlantCard
              key={plant.id}
              plantInstance={plant}
              onQuickWater={handleQuickWater}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Filter/Search section - placeholder for future */}
      {plants.length > 0 && (
        <div className="mt-8 text-center text-earth-500">
          <p>Filter by location, health status, or plant type (coming soon)</p>
        </div>
      )}
    </div>
  )
}