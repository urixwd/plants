'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { PhotosSDK } from '@/lib/sdk/photos'

interface PhotoUploadProps {
  plantInstanceId: string
  onUploadSuccess?: (photoUrl: string) => void
  onUploadError?: (error: string) => void
  allowMultiple?: boolean
  maxFileSize?: number // in MB
}

export function PhotoUpload({
  plantInstanceId,
  onUploadSuccess,
  onUploadError,
  allowMultiple = false,
  maxFileSize = 10
}: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [caption, setCaption] = useState('')
  const [isMainPhoto, setIsMainPhoto] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0] // Take first file for now
    uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      onUploadError?.('Please select an image file')
      return
    }

    // Validate file size
    if (file.size > maxFileSize * 1024 * 1024) {
      onUploadError?.(`File size must be less than ${maxFileSize}MB`)
      return
    }

    setIsUploading(true)
    try {
      const photo = await PhotosSDK.upload(plantInstanceId, file, {
        caption: caption.trim() || undefined,
        isMainPhoto,
      })

      onUploadSuccess?.(photo.photoUrl)

      // Reset form
      setCaption('')
      setIsMainPhoto(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Upload error:', error)
      onUploadError?.(
        error instanceof Error ? error.message : 'Failed to upload photo'
      )
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>📷</span>
          <span>Upload Photo</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Caption Input */}
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-2">
            Photo Caption (optional)
          </label>
          <Input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Describe this photo..."
            disabled={isUploading}
          />
        </div>

        {/* Main Photo Toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="main-photo"
            checked={isMainPhoto}
            onChange={(e) => setIsMainPhoto(e.target.checked)}
            disabled={isUploading}
            className="rounded border-earth-300"
          />
          <label htmlFor="main-photo" className="text-sm text-earth-700">
            Set as main photo for this plant
          </label>
        </div>

        {/* Drop Zone */}
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${dragOver ? 'border-primary-400 bg-primary-50' : 'border-earth-300'}
            ${isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="space-y-2">
              <div className="text-2xl">⏳</div>
              <p className="text-earth-600">Uploading photo...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-4xl text-earth-400">📸</div>
              <div>
                <p className="text-lg font-medium text-earth-700">
                  Drop your photo here or click to browse
                </p>
                <p className="text-sm text-earth-500 mt-2">
                  Supports JPEG, PNG, WebP, GIF • Max {maxFileSize}MB
                </p>
              </div>
              <Button variant="outline" type="button">
                Select Photo
              </Button>
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex flex-wrap gap-2 text-xs text-earth-500">
          <Badge variant="outline">JPEG</Badge>
          <Badge variant="outline">PNG</Badge>
          <Badge variant="outline">WebP</Badge>
          <Badge variant="outline">GIF</Badge>
          <Badge variant="outline">Max {maxFileSize}MB</Badge>
        </div>
      </CardContent>
    </Card>
  )
}