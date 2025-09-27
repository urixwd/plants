import { supabase } from '@/lib/supabase'
import type {
  PlantPhoto,
  InsertPlantPhoto,
} from '@/db/types'

export class PhotosSDK {
  /**
   * Transform camelCase TypeScript properties to snake_case database columns
   */
  private static transformToDatabase(photo: any): any {
    const result: any = {}

    if (photo.id !== undefined) result.id = photo.id
    if (photo.plantInstanceId !== undefined) result.plant_instance_id = photo.plantInstanceId
    if (photo.photoUrl !== undefined) result.photo_url = photo.photoUrl
    if (photo.caption !== undefined) result.caption = photo.caption
    if (photo.photoDate !== undefined) result.photo_date = photo.photoDate
    if (photo.isMainPhoto !== undefined) result.is_main_photo = photo.isMainPhoto
    if (photo.createdAt !== undefined) result.created_at = photo.createdAt
    if (photo.updatedAt !== undefined) result.updated_at = photo.updatedAt

    return result
  }

  /**
   * Transform snake_case database columns to camelCase TypeScript properties
   */
  private static transformFromDatabase(photo: any): any {
    return {
      idAuto: photo.id_auto,
      id: photo.id,
      plantInstanceId: photo.plant_instance_id,
      photoUrl: photo.photo_url,
      caption: photo.caption,
      photoDate: photo.photo_date,
      isMainPhoto: photo.is_main_photo,
      createdAt: photo.created_at,
      updatedAt: photo.updated_at,
    }
  }

  /**
   * Upload a photo to Supabase Storage and save record
   */
  static async upload(
    plantInstanceId: string,
    file: File,
    options: {
      caption?: string
      isMainPhoto?: boolean
    } = {}
  ): Promise<PlantPhoto> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('plantInstanceId', plantInstanceId)
    if (options.caption) formData.append('caption', options.caption)
    formData.append('isMainPhoto', String(options.isMainPhoto || false))

    const response = await fetch('/api/photos/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to upload photo')
    }

    const { photo } = await response.json()
    return photo
  }

  /**
   * Get all photos for a plant instance
   */
  static async getForPlant(plantInstanceId: string): Promise<PlantPhoto[]> {
    const { data, error } = await supabase
      .from('plant_photos')
      .select('*')
      .eq('plant_instance_id', plantInstanceId)
      .order('photo_date', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(photo => this.transformFromDatabase(photo))
  }

  /**
   * Get main photo for a plant instance
   */
  static async getMainPhoto(plantInstanceId: string): Promise<PlantPhoto | null> {
    const { data, error } = await supabase
      .from('plant_photos')
      .select('*')
      .eq('plant_instance_id', plantInstanceId)
      .eq('is_main_photo', true)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data ? this.transformFromDatabase(data) : null
  }

  /**
   * Set a photo as the main photo for a plant instance
   */
  static async setAsMain(photoId: string, plantInstanceId: string): Promise<PlantPhoto> {
    // First, unset any existing main photo
    await supabase
      .from('plant_photos')
      .update({ is_main_photo: false })
      .eq('plant_instance_id', plantInstanceId)
      .eq('is_main_photo', true)

    // Set the new main photo
    const { data, error } = await supabase
      .from('plant_photos')
      .update({ is_main_photo: true })
      .eq('id', photoId)
      .select()
      .single()

    if (error) throw error
    return this.transformFromDatabase(data)
  }

  /**
   * Update photo caption
   */
  static async updateCaption(photoId: string, caption: string): Promise<PlantPhoto> {
    const { data, error } = await supabase
      .from('plant_photos')
      .update({ caption })
      .eq('id', photoId)
      .select()
      .single()

    if (error) throw error
    return this.transformFromDatabase(data)
  }

  /**
   * Delete a photo (removes from storage and database)
   */
  static async delete(photoId: string): Promise<void> {
    // Get photo record first to get the file path
    const { data: photo, error: fetchError } = await supabase
      .from('plant_photos')
      .select('photo_url')
      .eq('id', photoId)
      .single()

    if (fetchError) throw fetchError

    // Extract file path from URL
    const url = new URL(photo.photo_url)
    const filePath = url.pathname.split('/').slice(-2).join('/') // Get last two segments

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('plant-photos')
      .remove([filePath])

    if (storageError) throw storageError

    // Delete from database
    const { error: dbError } = await supabase
      .from('plant_photos')
      .delete()
      .eq('id', photoId)

    if (dbError) throw dbError
  }

  /**
   * Get recent photos across all plants
   */
  static async getRecent(limit = 20): Promise<PlantPhoto[]> {
    const { data, error } = await supabase
      .from('plant_photos')
      .select(`
        *,
        plant_instance:plant_instances(
          nickname,
          plant:plants(english_name, scientific_name)
        )
      `)
      .order('photo_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return (data || []).map(photo => this.transformFromDatabase(photo))
  }

  /**
   * Create photo gallery for a plant instance
   */
  static async getGallery(plantInstanceId: string): Promise<{
    mainPhoto: PlantPhoto | null
    gallery: PlantPhoto[]
  }> {
    const [mainPhoto, allPhotos] = await Promise.all([
      this.getMainPhoto(plantInstanceId),
      this.getForPlant(plantInstanceId),
    ])

    // Filter out main photo from gallery
    const gallery = allPhotos.filter(photo => !photo.isMainPhoto)

    return {
      mainPhoto,
      gallery,
    }
  }
}