'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PhotoUpload } from '@/components/photos/photo-upload'
import { PhotoGallery } from '@/components/photos/photo-gallery'
import { PlantInstancesSDK } from '@/lib/sdk/instances'
import type { PlantInstanceWithPlant } from '@/lib/sdk'

export default function PlantPhotosPage() {
  const params = useParams()
  const router = useRouter()
  const [plant, setPlant] = useState<PlantInstanceWithPlant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [uploadMessage, setUploadMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  useEffect(() => {
    async function loadPlant() {
      try {
        const id = params.id as string
        const plantData = await PlantInstancesSDK.getById(id)
        if (plantData) {
          setPlant(plantData)
        }
      } catch (error) {
        console.error('Error loading plant:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      loadPlant()
    }
  }, [params.id])

  const handleUploadSuccess = (photoUrl: string) => {
    setUploadMessage({
      type: 'success',
      text: 'Photo uploaded successfully!'
    })
    setShowUpload(false)
    setRefreshTrigger(prev => prev + 1)

    // Clear message after 3 seconds
    setTimeout(() => setUploadMessage(null), 3000)
  }

  const handleUploadError = (error: string) => {
    setUploadMessage({
      type: 'error',
      text: error
    })

    // Clear message after 5 seconds
    setTimeout(() => setUploadMessage(null), 5000)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-earth-600">Loading plant...</p>
        </div>
      </div>
    )
  }

  if (!plant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <p className="text-red-600">Plant not found</p>
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
            📷 {plant.nickname || plant.plant.englishName} Photos
          </h1>
          <p className="text-xl italic text-earth-600">
            {plant.plant.scientificName}
          </p>
          <p className="text-earth-500">
            {plant.location} • {plant.healthStatus}
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => router.back()}>
            ← Back to Plant
          </Button>
          <Button onClick={() => setShowUpload(!showUpload)}>
            {showUpload ? 'Cancel' : '📸 Add Photo'}
          </Button>
        </div>
      </div>

      {/* Upload Message */}
      {uploadMessage && (
        <Card className={`border ${
          uploadMessage.type === 'success'
            ? 'border-green-200 bg-green-50'
            : 'border-red-200 bg-red-50'
        }`}>
          <CardContent className="p-4">
            <p className={`font-medium ${
              uploadMessage.type === 'success'
                ? 'text-green-800'
                : 'text-red-800'
            }`}>
              {uploadMessage.type === 'success' ? '✅' : '❌'} {uploadMessage.text}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Upload Section */}
      {showUpload && (
        <PhotoUpload
          plantInstanceId={plant.id}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          maxFileSize={10}
        />
      )}

      {/* Gallery */}
      <PhotoGallery
        plantInstanceId={plant.id}
        showUploadButton={!showUpload}
        onUploadClick={() => setShowUpload(true)}
        refreshTrigger={refreshTrigger}
      />

      {/* Plant Info Card */}
      <Card className="bg-primary-50 border-primary-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🌱</span>
            <span>Plant Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Common Name:</strong> {plant.plant.englishName}
            </div>
            <div>
              <strong>Scientific Name:</strong> {plant.plant.scientificName}
            </div>
            <div>
              <strong>Location:</strong> {plant.location}
            </div>
            <div>
              <strong>Health Status:</strong> {plant.healthStatus}
            </div>
            <div>
              <strong>Pot Size:</strong> {plant.potSize?.toUpperCase()}
            </div>
            <div>
              <strong>Sun Type:</strong> {plant.sunType}
            </div>
          </div>
          {plant.notes && (
            <div className="mt-4 pt-4 border-t border-primary-200">
              <strong>Notes:</strong>
              <p className="mt-1 text-earth-600">{plant.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}