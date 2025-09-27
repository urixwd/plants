'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PhotosSDK } from '@/lib/sdk/photos'
import type { PlantPhoto } from '@/db/types/plants.types'

interface PhotoGalleryProps {
  plantInstanceId: string
  showUploadButton?: boolean
  onUploadClick?: () => void
  refreshTrigger?: number // Use to trigger refresh after upload
}

export function PhotoGallery({
  plantInstanceId,
  showUploadButton = true,
  onUploadClick,
  refreshTrigger = 0
}: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<PlantPhoto[]>([])
  const [mainPhoto, setMainPhoto] = useState<PlantPhoto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState<PlantPhoto | null>(null)

  useEffect(() => {
    loadPhotos()
  }, [plantInstanceId, refreshTrigger])

  const loadPhotos = async () => {
    try {
      setIsLoading(true)
      const { mainPhoto, gallery } = await PhotosSDK.getGallery(plantInstanceId)
      setMainPhoto(mainPhoto)
      setPhotos(gallery)
    } catch (error) {
      console.error('Error loading photos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetAsMain = async (photo: PlantPhoto) => {
    try {
      await PhotosSDK.setAsMain(photo.id, plantInstanceId)
      await loadPhotos() // Refresh
    } catch (error) {
      console.error('Error setting main photo:', error)
    }
  }

  const handleDelete = async (photo: PlantPhoto) => {
    if (!confirm('Are you sure you want to delete this photo?')) return

    try {
      await PhotosSDK.delete(photo.id)
      await loadPhotos() // Refresh
      if (selectedPhoto?.id === photo.id) {
        setSelectedPhoto(null)
      }
    } catch (error) {
      console.error('Error deleting photo:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-earth-600">Loading photos...</p>
        </CardContent>
      </Card>
    )
  }

  const totalPhotos = (mainPhoto ? 1 : 0) + photos.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-primary-700">
          Photo Gallery ({totalPhotos} photo{totalPhotos !== 1 ? 's' : ''})
        </h3>
        {showUploadButton && (
          <Button onClick={onUploadClick} size="sm">
            📷 Add Photo
          </Button>
        )}
      </div>

      {/* Main Photo */}
      {mainPhoto && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <span>🌟</span>
                <span>Main Photo</span>
              </span>
              <Badge variant="success">Main</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative aspect-video bg-earth-50 rounded-lg overflow-hidden">
                <img
                  src={mainPhoto.photoUrl}
                  alt={mainPhoto.caption || 'Plant photo'}
                  className="w-full h-full object-cover"
                />
              </div>
              {mainPhoto.caption && (
                <p className="text-earth-600">{mainPhoto.caption}</p>
              )}
              <div className="flex justify-between items-center text-sm text-earth-500">
                <span>{formatDate(mainPhoto.photoDate || mainPhoto.createdAt)}</span>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPhoto(mainPhoto)}
                  >
                    View Full
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(mainPhoto)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gallery Grid */}
      {photos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Gallery ({photos.length} photo{photos.length !== 1 ? 's' : ''})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="space-y-2">
                  <div className="relative aspect-square bg-earth-50 rounded-lg overflow-hidden group">
                    <img
                      src={photo.photoUrl}
                      alt={photo.caption || 'Plant photo'}
                      className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105"
                      onClick={() => setSelectedPhoto(photo)}
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
                  </div>
                  {photo.caption && (
                    <p className="text-xs text-earth-600 line-clamp-2">
                      {photo.caption}
                    </p>
                  )}
                  <div className="flex justify-between items-center text-xs text-earth-500">
                    <span>{formatDate(photo.photoDate || photo.createdAt)}</span>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => handleSetAsMain(photo)}
                        title="Set as main photo"
                      >
                        ⭐
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(photo)}
                        title="Delete photo"
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {totalPhotos === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="text-6xl text-earth-300">📷</div>
              <div>
                <h3 className="text-lg font-medium text-earth-700">No photos yet</h3>
                <p className="text-earth-500 mt-2">
                  Start documenting your plant's growth by uploading photos
                </p>
              </div>
              {showUploadButton && (
                <Button onClick={onUploadClick}>
                  📸 Upload Your First Photo
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {selectedPhoto.caption || 'Plant Photo'}
                </h3>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedPhoto(null)}
                  className="text-earth-500 hover:text-earth-700"
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="p-4">
              <img
                src={selectedPhoto.photoUrl}
                alt={selectedPhoto.caption || 'Plant photo'}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-earth-500">
                  {formatDate(selectedPhoto.photoDate || selectedPhoto.createdAt)}
                </span>
                <div className="space-x-2">
                  {!selectedPhoto.isMainPhoto && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleSetAsMain(selectedPhoto)
                        setSelectedPhoto(null)
                      }}
                    >
                      ⭐ Set as Main
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleDelete(selectedPhoto)
                      setSelectedPhoto(null)
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    🗑️ Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}