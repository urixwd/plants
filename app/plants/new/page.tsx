'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PlantForm } from '@/components/plants/plant-form'
import { Button } from '@/components/ui/button'
import { PlantsSDK } from '@/lib/sdk/plants'
import type { InsertPlantInstance, Plant } from '@/lib/sdk'

export default function NewPlantPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
  const [isLoadingPlant, setIsLoadingPlant] = useState(false)

  useEffect(() => {
    const plantId = searchParams.get('plantId')
    if (plantId) {
      setIsLoadingPlant(true)
      PlantsSDK.getById(plantId)
        .then((plant) => {
          if (plant) {
            setSelectedPlant(plant)
          }
        })
        .catch((error) => {
          console.error('Error loading plant:', error)
        })
        .finally(() => {
          setIsLoadingPlant(false)
        })
    }
  }, [searchParams])

  const handleSubmit = async (plantInstance: InsertPlantInstance) => {
    // PlantForm already handles the SDK call
    setIsSuccess(true)

    // Redirect to plants list after success
    setTimeout(() => {
      router.push('/plants')
    }, 2000)
  }

  const handleCancel = () => {
    router.push('/plants')
  }

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <div className="text-6xl">🎉</div>
          <h1 className="text-3xl font-bold text-primary-800">
            Plant Added Successfully!
          </h1>
          <p className="text-xl text-earth-600">
            Your new plant has been added to your collection.
          </p>
          <p className="text-earth-500">
            Redirecting to your plants...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary-800">
          🌱 Add New Plant
        </h1>
        <p className="text-xl text-earth-600">
          Add a plant to your collection
        </p>
      </div>

      {/* Selected Plant Info */}
      {selectedPlant && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-2xl mx-auto">
          <h3 className="font-semibold text-green-800 mb-2">
            Adding: {selectedPlant.englishName}
          </h3>
          <p className="text-sm italic text-green-600">{selectedPlant.scientificName}</p>
        </div>
      )}

      {/* Plant Form */}
      {isLoadingPlant ? (
        <div className="text-center text-earth-600">
          Loading plant details...
        </div>
      ) : (
        <PlantForm
          plant={selectedPlant || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* Help Section */}
      <div className="text-center space-y-4 mt-12 p-6 bg-earth-50 rounded-lg max-w-2xl mx-auto">
        <h3 className="text-lg font-medium text-earth-800">Need Help?</h3>
        <div className="text-sm text-earth-600 space-y-2">
          <p>
            <strong>Plant Type:</strong> Start typing to search our botanical database
          </p>
          <p>
            <strong>Location:</strong> Choose where the plant will live in your home
          </p>
          <p>
            <strong>Sun Strength:</strong> 1=Very Low Light, 5=Very Bright/Direct Sun
          </p>
          <p>
            <strong>Pot Size:</strong> XS=2-3", S=4-6", M=7-9", L=10-12", XL=13"+
          </p>
        </div>
      </div>
    </div>
  )
}