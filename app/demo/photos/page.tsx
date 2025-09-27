'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PhotoUpload } from '@/components/photos/photo-upload'
import { PhotoGallery } from '@/components/photos/photo-gallery'

export default function PhotoDemoPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [uploadMessage, setUploadMessage] = useState<string | null>(null)

  // Demo plant instance ID (would need a real one for actual uploads)
  const demoPlantId = 'demo-plant-123'

  const handleUploadSuccess = (photoUrl: string) => {
    setUploadMessage('Photo uploaded successfully! (Demo)')
    setRefreshTrigger(prev => prev + 1)
    setTimeout(() => setUploadMessage(null), 3000)
  }

  const handleUploadError = (error: string) => {
    setUploadMessage(`Upload error: ${error}`)
    setTimeout(() => setUploadMessage(null), 5000)
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary-800">
          📷 Photo Upload Demo
        </h1>
        <p className="text-xl text-earth-600">
          Test the photo upload and gallery components
        </p>
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 max-w-2xl mx-auto">
          <p className="text-yellow-800 text-sm">
            <strong>Note:</strong> This is a demo page. To test actual photo uploads,
            first add a plant to your collection from the Plant Library.
          </p>
        </div>
      </div>

      {/* Upload Message */}
      {uploadMessage && (
        <Card className="border-blue-200 bg-blue-50 max-w-2xl mx-auto">
          <CardContent className="p-4">
            <p className="text-blue-800 text-center">{uploadMessage}</p>
          </CardContent>
        </Card>
      )}

      {/* Photo Upload Component */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary-700">Photo Upload Component</h2>
        <div className="max-w-2xl mx-auto">
          <PhotoUpload
            plantInstanceId={demoPlantId}
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            maxFileSize={10}
          />
        </div>
      </section>

      {/* Photo Gallery Component */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary-700">Photo Gallery Component</h2>
        <div className="max-w-4xl mx-auto">
          <PhotoGallery
            plantInstanceId={demoPlantId}
            showUploadButton={false}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </section>

      {/* Features List */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary-700">Photo Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-earth-700">
                <li>• Drag and drop support</li>
                <li>• File type validation (JPEG, PNG, WebP, GIF)</li>
                <li>• File size limit (configurable, default 10MB)</li>
                <li>• Caption support</li>
                <li>• Set as main photo option</li>
                <li>• Upload progress indication</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gallery Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-earth-700">
                <li>• Main photo display with special badge</li>
                <li>• Grid layout for additional photos</li>
                <li>• Full-screen photo viewer modal</li>
                <li>• Set any photo as main photo</li>
                <li>• Delete photos with confirmation</li>
                <li>• Photo metadata (date, caption)</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Integration Info */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary-700">Integration</h2>
        <Card className="bg-earth-50">
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-earth-800">How to use photos:</h3>
              <ol className="list-decimal list-inside space-y-2 text-earth-700">
                <li>Go to <strong>Plant Library</strong> and browse available plants</li>
                <li>Click <strong>"Add to My Collection"</strong> on any plant</li>
                <li>Fill out the plant details form and submit</li>
                <li>In your <strong>My Plants</strong> collection, click the 📷 button on any plant card</li>
                <li>Upload photos, set captions, and manage your plant gallery!</li>
              </ol>

              <div className="mt-4 pt-4 border-t border-earth-200">
                <p className="text-sm text-earth-600">
                  <strong>Technical:</strong> Photos are stored in Supabase Storage with automatic
                  file naming, public URL generation, and database metadata tracking.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}