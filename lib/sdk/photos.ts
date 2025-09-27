import { supabase } from '@/lib/supabase'
import type {
  PlantPhoto,
  InsertPlantPhoto,
} from '@/db/types'

export class PhotosSDK {
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
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${plantInstanceId}/${Date.now()}.${fileExt}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('plant-photos')
      .upload(fileName, file)

    if (uploadError) throw uploadError

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('plant-photos')
      .getPublicUrl(uploadData.path)

    // If this is a main photo, unset any existing main photo first
    if (options.isMainPhoto) {
      await supabase
        .from('plant_photos')
        .update({ is_main_photo: false })
        .eq('plant_instance_id', plantInstanceId)
        .eq('is_main_photo', true)
    }

    // Save photo record to database
    const photoRecord: InsertPlantPhoto = {
      plantInstanceId,
      photoUrl: urlData.publicUrl,
      caption: options.caption,
      isMainPhoto: options.isMainPhoto || false,
    }

    const { data, error } = await supabase
      .from('plant_photos')
      .insert(photoRecord)
      .select()
      .single()

    if (error) throw error
    return data
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
    return data || []
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
    return data || null
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
    return data
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
    return data
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
    return data || []
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