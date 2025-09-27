'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { PlantInstancesSDK, PlantsSDK } from "@/lib/sdk"
import type { InsertPlantInstance, Plant, Location, PotSize, SunType } from "@/lib/sdk"

interface PlantFormProps {
  plant?: Plant
  onSubmit?: (plantInstance: InsertPlantInstance) => void
  onCancel?: () => void
  isLoading?: boolean
}

export function PlantForm({ plant, onSubmit, onCancel, isLoading }: PlantFormProps) {
  const [formData, setFormData] = useState<Partial<InsertPlantInstance>>({
    plantId: plant?.id || '',
    nickname: '',
    acquisitionDate: new Date().toISOString().split('T')[0], // Today
    acquisitionSource: '',
    potSize: 'm' as PotSize,
    location: 'living room' as Location,
    sunType: 'indirect' as SunType,
    sunStrength: 3,
    healthStatus: 'healthy',
    notes: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (
    field: keyof InsertPlantInstance,
    value: string | number
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting || !formData.plantId) return

    setIsSubmitting(true)
    try {
      const plantInstanceData: InsertPlantInstance = {
        plantId: formData.plantId!,
        nickname: formData.nickname || undefined,
        acquisitionDate: formData.acquisitionDate || undefined,
        acquisitionSource: formData.acquisitionSource || undefined,
        potSize: formData.potSize as PotSize,
        location: formData.location as Location,
        sunType: formData.sunType as SunType,
        sunStrength: Number(formData.sunStrength),
        healthStatus: formData.healthStatus as any,
        notes: formData.notes || undefined,
      }

      await PlantInstancesSDK.create(plantInstanceData)
      onSubmit?.(plantInstanceData)
    } catch (error) {
      console.error('Failed to create plant instance:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const locations: Location[] = [
    'big balcony', 'small balcony', 'living room', 'kitchen',
    'dining room', 'entrance', 'hall', 'office',
    'goni bathroom', 'goni bedroom', 'goni balcony',
    'parent bathroom', 'parent bedroom'
  ]

  const potSizes: PotSize[] = ['xs', 's', 'm', 'l', 'xl']

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add Plant to Your Collection</CardTitle>
        {plant && (
          <div className="text-earth-600">
            <p className="font-medium">{plant.englishName}</p>
            <p className="text-sm italic">{plant.scientificName}</p>
          </div>
        )}
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Plant Selection - if no plant provided */}
          {!plant && (
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">
                Plant Type *
              </label>
              <Input
                placeholder="Search for a plant type..."
                value={formData.plantId}
                onChange={(e) => handleInputChange('plantId', e.target.value)}
                required
              />
              <p className="text-xs text-earth-500 mt-1">
                Start typing to search the botanical database
              </p>
            </div>
          )}

          {/* Nickname */}
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">
              Nickname (optional)
            </label>
            <Input
              placeholder="Give your plant a name..."
              value={formData.nickname}
              onChange={(e) => handleInputChange('nickname', e.target.value)}
            />
          </div>

          {/* Acquisition Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">
                Date Acquired
              </label>
              <Input
                type="date"
                value={formData.acquisitionDate}
                onChange={(e) => handleInputChange('acquisitionDate', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">
                Where did you get it?
              </label>
              <Input
                placeholder="e.g., Plant store, Friend, Online..."
                value={formData.acquisitionSource}
                onChange={(e) => handleInputChange('acquisitionSource', e.target.value)}
              />
            </div>
          </div>

          {/* Current Setup */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">
                Pot Size *
              </label>
              <Select
                value={formData.potSize}
                onChange={(e) => handleInputChange('potSize', e.target.value)}
                required
              >
                {potSizes.map(size => (
                  <option key={size} value={size}>
                    {size.toUpperCase()}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">
                Location *
              </label>
              <Select
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
              >
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location.split(' ').map(word =>
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">
                Sun Type *
              </label>
              <Select
                value={formData.sunType}
                onChange={(e) => handleInputChange('sunType', e.target.value)}
                required
              >
                <option value="direct">Direct</option>
                <option value="indirect">Indirect</option>
              </Select>
            </div>
          </div>

          {/* Sun Strength */}
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">
              Sun Strength: {formData.sunStrength}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={formData.sunStrength}
              onChange={(e) => handleInputChange('sunStrength', Number(e.target.value))}
              className="w-full h-2 bg-earth-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-earth-500 mt-1">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              placeholder="Any special notes about this plant..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-earth-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-earth-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              rows={3}
            />
          </div>
        </CardContent>

        <CardFooter className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !formData.plantId}
            className="flex-1"
          >
            {isSubmitting ? 'Adding Plant...' : 'Add to Collection'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}