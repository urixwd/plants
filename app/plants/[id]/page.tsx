'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { PlantInstancesSDK, CareEventsSDK, PhotosSDK } from '@/lib/sdk'
import type { PlantInstanceWithPlant, PlantPhoto } from '@/lib/sdk'

export default function PlantDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [plant, setPlant] = useState<PlantInstanceWithPlant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isWatering, setIsWatering] = useState(false)
  const [showCareLog, setShowCareLog] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [careEvents, setCareEvents] = useState<any[]>([])
  const [careStats, setCareStats] = useState<any>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [editForm, setEditForm] = useState({
    nickname: '',
    location: '',
    healthStatus: '',
    potSize: '',
    notes: ''
  })
  const [showOtherEventInput, setShowOtherEventInput] = useState(false)
  const [otherEventType, setOtherEventType] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [photos, setPhotos] = useState<PlantPhoto[]>([])
  const [mainPhoto, setMainPhoto] = useState<PlantPhoto | null>(null)

  useEffect(() => {
    loadPlant()
    loadPhotos()
  }, [params.id])

  const loadCareData = async () => {
    if (!plant) return

    try {
      const [events, stats] = await Promise.all([
        CareEventsSDK.getForPlant(plant.id),
        CareEventsSDK.getStats(plant.id)
      ])
      setCareEvents(events)
      setCareStats(stats)
    } catch (error) {
      console.error('Failed to load care data:', error)
    }
  }

  const loadPhotos = async () => {
    if (!params.id) return

    try {
      const gallery = await PhotosSDK.getGallery(params.id as string)
      setMainPhoto(gallery.mainPhoto)
      setPhotos(gallery.gallery)
    } catch (error) {
      console.error('Failed to load photos:', error)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!plant || isUpdating) return

    setIsUpdating(true)
    try {
      await PlantInstancesSDK.update(plant.id, {
        nickname: editForm.nickname || null,
        location: editForm.location as any,
        healthStatus: editForm.healthStatus as any,
        potSize: editForm.potSize as any,
        notes: editForm.notes || null
      })

      // Reload plant data to show updates
      await loadPlant()
      setShowEditForm(false)
    } catch (error) {
      console.error('Failed to update plant:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const loadPlant = async () => {
    try {
      if (typeof params.id === 'string') {
        const data = await PlantInstancesSDK.getById(params.id)
        if (data) {
          setPlant(data)
          // Initialize edit form with current plant data
          setEditForm({
            nickname: data.nickname || '',
            location: data.location || '',
            healthStatus: data.healthStatus || '',
            potSize: data.potSize || '',
            notes: data.notes || ''
          })
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
      // Reload plant data and care data to show updated info
      await loadPlant()
      if (showCareLog) {
        await loadCareData()
      }
    } catch (error) {
      console.error('Failed to log watering:', error)
    } finally {
      setIsWatering(false)
    }
  }

  const formatEventTypeName = (eventType: string) => {
    switch (eventType) {
      case 'pest_treatment': return 'Pest Treatment'
      case 'change_soil': return 'Change Soil'
      case 'move_location': return 'Move Location'
      default: return eventType.charAt(0).toUpperCase() + eventType.slice(1)
    }
  }

  const handleCareEvent = async (eventType: string, eventData: any = {}) => {
    if (!plant) return

    if (eventType === 'other') {
      setShowOtherEventInput(true)
      return
    }

    try {
      await CareEventsSDK.log(plant.id, {
        type: eventType as any,
        notes: eventData.notes || `${formatEventTypeName(eventType)} event logged`,
        waterAmount: eventData.waterAmount,
        fertilizerType: eventData.fertilizerType
      })

      // Reload care data if visible
      if (showCareLog) {
        await loadCareData()
      }
    } catch (error) {
      console.error(`Failed to log ${eventType} event:`, error)
    }
  }

  const handleOtherEventSubmit = async () => {
    if (!plant || !otherEventType.trim()) return

    try {
      await CareEventsSDK.log(plant.id, {
        type: 'other' as any,
        notes: otherEventType.trim()
      })

      // Reset form and hide input
      setOtherEventType('')
      setShowOtherEventInput(false)

      // Reload care data if visible
      if (showCareLog) {
        await loadCareData()
      }
    } catch (error) {
      console.error('Failed to log other event:', error)
    }
  }

  const handleDeletePlant = async () => {
    if (!plant || isDeleting) return

    setIsDeleting(true)
    try {
      await PlantInstancesSDK.delete(plant.id)
      router.push('/plants')
    } catch (error) {
      console.error('Failed to delete plant:', error)
      setIsDeleting(false)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await CareEventsSDK.delete(eventId)
      // Reload care data
      await loadCareData()
    } catch (error) {
      console.error('Failed to delete event:', error)
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

      {/* Photo Gallery */}
      {(mainPhoto || photos.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Main Photo */}
              {mainPhoto && (
                <div>
                  <div className="text-sm text-earth-600 mb-2 flex items-center justify-between">
                    <span>Main Photo</span>
                    <Badge variant="outline">Main</Badge>
                  </div>
                  <div className="relative aspect-video bg-earth-100 rounded-lg overflow-hidden">
                    <img
                      src={mainPhoto.photoUrl}
                      alt={mainPhoto.caption || "Main plant photo"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {mainPhoto.caption && (
                    <p className="text-sm text-earth-600 mt-2">{mainPhoto.caption}</p>
                  )}
                </div>
              )}

              {/* Gallery Photos */}
              {photos.length > 0 && (
                <div>
                  <div className="text-sm text-earth-600 mb-2">
                    Gallery ({photos.length})
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {photos.map((photo) => (
                      <div key={photo.id} className="relative aspect-square bg-earth-100 rounded-lg overflow-hidden group">
                        <img
                          src={photo.photoUrl}
                          alt={photo.caption || "Plant photo"}
                          className="w-full h-full object-cover"
                        />
                        {photo.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {photo.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Photo Button */}
              <div className="pt-4 border-t border-earth-200">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/plants/${plant.id}/photos`)}
                  className="w-full"
                >
                  📷 Add More Photos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
          <div className="space-y-6">
            {/* Primary Actions */}
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
                onClick={async () => {
                  if (!showCareLog) {
                    await loadCareData()
                  }
                  setShowCareLog(!showCareLog)
                }}
                className="flex flex-col items-center space-y-2 h-auto py-4"
              >
                <span className="text-2xl">📝</span>
                <span>{showCareLog ? 'Hide Log' : 'Care Log'}</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowEditForm(!showEditForm)}
                className="flex flex-col items-center space-y-2 h-auto py-4"
              >
                <span className="text-2xl">✏️</span>
                <span>{showEditForm ? 'Cancel' : 'Edit'}</span>
              </Button>
            </div>

            {/* Care Events */}
            <div>
              <h4 className="font-semibold text-earth-700 mb-3">Quick Care Actions</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCareEvent('fertilizer')}
                  className="flex flex-col items-center space-y-1 h-auto py-3"
                >
                  <span className="text-lg">🌱</span>
                  <span className="text-xs">Fertilize</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCareEvent('pruning')}
                  className="flex flex-col items-center space-y-1 h-auto py-3"
                >
                  <span className="text-lg">✂️</span>
                  <span className="text-xs">Prune</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCareEvent('repot')}
                  className="flex flex-col items-center space-y-1 h-auto py-3"
                >
                  <span className="text-lg">🪴</span>
                  <span className="text-xs">Repot</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCareEvent('change_soil')}
                  className="flex flex-col items-center space-y-1 h-auto py-3"
                >
                  <span className="text-lg">🪨</span>
                  <span className="text-xs">Soil</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCareEvent('trim')}
                  className="flex flex-col items-center space-y-1 h-auto py-3"
                >
                  <span className="text-lg">🌿</span>
                  <span className="text-xs">Trim</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCareEvent('pest_treatment')}
                  className="flex flex-col items-center space-y-1 h-auto py-3"
                >
                  <span className="text-lg">🐛</span>
                  <span className="text-xs">Pest</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCareEvent('move_location')}
                  className="flex flex-col items-center space-y-1 h-auto py-3"
                >
                  <span className="text-lg">📍</span>
                  <span className="text-xs">Move</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCareEvent('other')}
                  className="flex flex-col items-center space-y-1 h-auto py-3"
                >
                  <span className="text-lg">📋</span>
                  <span className="text-xs">Other</span>
                </Button>
              </div>
            </div>

            {/* Custom Other Event Input */}
            {showOtherEventInput && (
              <div className="border rounded-lg p-4 bg-earth-50">
                <h5 className="font-medium text-earth-700 mb-3">Log Custom Care Event</h5>
                <div className="space-y-3">
                  <Input
                    value={otherEventType}
                    onChange={(e) => setOtherEventType(e.target.value)}
                    placeholder="Describe the care activity (e.g., 'Wiped leaves', 'Rotated plant', 'Added support stake')"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleOtherEventSubmit()
                      }
                    }}
                  />
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={handleOtherEventSubmit}
                      disabled={!otherEventType.trim()}
                    >
                      Log Event
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowOtherEventInput(false)
                        setOtherEventType('')
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      {showEditForm && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Plant Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Nickname */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-earth-700">
                    Nickname
                  </label>
                  <Input
                    value={editForm.nickname}
                    onChange={(e) => setEditForm(prev => ({ ...prev, nickname: e.target.value }))}
                    placeholder="Give your plant a nickname..."
                  />
                </div>

                {/* Health Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-earth-700">
                    Health Status
                  </label>
                  <Select
                    value={editForm.healthStatus}
                    onChange={(e) => setEditForm(prev => ({ ...prev, healthStatus: e.target.value }))}
                  >
                    <option value="">Select health status</option>
                    <option value="healthy">Healthy</option>
                    <option value="struggling">Struggling</option>
                    <option value="sick">Sick</option>
                    <option value="dead">Dead</option>
                  </Select>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-earth-700">
                    Location
                  </label>
                  <Select
                    value={editForm.location}
                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                  >
                    <option value="">Select location</option>
                    <option value="big balcony">Big Balcony</option>
                    <option value="small balcony">Small Balcony</option>
                    <option value="living room">Living Room</option>
                    <option value="bedroom">Bedroom</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="bathroom">Bathroom</option>
                    <option value="office">Office</option>
                  </Select>
                </div>

                {/* Pot Size */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-earth-700">
                    Pot Size
                  </label>
                  <Select
                    value={editForm.potSize}
                    onChange={(e) => setEditForm(prev => ({ ...prev, potSize: e.target.value }))}
                  >
                    <option value="">Select pot size</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="xl">Extra Large</option>
                  </Select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-earth-700">
                  Notes
                </label>
                <Textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any notes about this plant..."
                  rows={3}
                />
              </div>

              {/* Form Actions */}
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1"
                  >
                    {isUpdating ? 'Updating...' : 'Save Changes'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>

                {/* Delete Plant Section */}
                <div className="pt-4 border-t border-earth-200">
                  <div className="text-sm text-earth-600 mb-2">
                    Danger Zone
                  </div>
                  {!showDeleteConfirm ? (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      🗑️ Delete Plant
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-red-600">
                        Are you sure? This will permanently delete the plant and all its care history.
                      </p>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={handleDeletePlant}
                          disabled={isDeleting}
                        >
                          {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowDeleteConfirm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Care Log */}
      {showCareLog && (
        <Card>
          <CardHeader>
            <CardTitle>Care Log & Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Care Stats */}
            {careStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-700">{careStats.totalEvents}</div>
                  <div className="text-sm text-earth-600">Total Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{careStats.wateringCount}</div>
                  <div className="text-sm text-earth-600">Waterings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{careStats.fertilizerCount}</div>
                  <div className="text-sm text-earth-600">Fertilizations</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-earth-700">
                    {careStats.lastWatering
                      ? new Date(careStats.lastWatering).toLocaleDateString()
                      : 'Never'
                    }
                  </div>
                  <div className="text-sm text-earth-600">Last Watered</div>
                </div>
              </div>
            )}

            {/* Recent Care Events */}
            {careEvents.length > 0 ? (
              <div className="space-y-4">
                <h4 className="font-semibold text-earth-700">Recent Events</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {careEvents.map((event, index) => (
                    <div key={event.id || index} className="border rounded-lg p-3 bg-earth-50">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">
                            {event.eventType === 'water' && '💧'}
                            {event.eventType === 'fertilizer' && '🌱'}
                            {event.eventType === 'repot' && '🪴'}
                            {event.eventType === 'pruning' && '✂️'}
                            {event.eventType === 'change_soil' && '🪨'}
                            {event.eventType === 'trim' && '🌿'}
                            {event.eventType === 'pest_treatment' && '🐛'}
                            {event.eventType === 'move_location' && '📍'}
                            {event.eventType === 'photo' && '📷'}
                            {event.eventType === 'other' && '📋'}
                          </span>
                          <div>
                            <span className="font-medium">{formatEventTypeName(event.eventType)}</span>
                            {event.waterAmount && (
                              <span className="text-sm text-earth-600 ml-2">({event.waterAmount})</span>
                            )}
                            {event.fertilizerType && (
                              <span className="text-sm text-earth-600 ml-2">({event.fertilizerType})</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-earth-500">
                            {new Date(event.eventDate).toLocaleDateString()}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEvent(event.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                      {event.notes && (
                        <p className="text-sm text-earth-600 mt-2 ml-7">{event.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-earth-600">
                <p>No care events recorded yet</p>
                <p className="text-sm mt-2">Start by watering your plant or adding care notes!</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

    </div>
  )
}