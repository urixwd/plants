import { supabase } from '@/lib/supabase'
import type {
  PlantInstance,
  InsertPlantInstance,
  PlantInstanceWithPlant,
  PlantInstanceWithHistory,
  Location,
  HealthStatus,
} from '@/db/types'

export class PlantInstancesSDK {
  /**
   * Transform camelCase TypeScript properties to snake_case database columns
   */
  private static transformToDatabase(instance: any): any {
    const result: any = {}

    if (instance.id !== undefined) result.id = instance.id
    if (instance.plantId !== undefined) result.plant_id = instance.plantId
    if (instance.nickname !== undefined) result.nickname = instance.nickname
    if (instance.acquisitionDate !== undefined) result.acquisition_date = instance.acquisitionDate
    if (instance.acquisitionSource !== undefined) result.acquisition_source = instance.acquisitionSource
    if (instance.potSize !== undefined) result.pot_size = instance.potSize
    if (instance.location !== undefined) result.location = instance.location
    if (instance.sunType !== undefined) result.sun_type = instance.sunType
    if (instance.sunStrength !== undefined) result.sun_strength = instance.sunStrength
    if (instance.healthStatus !== undefined) result.health_status = instance.healthStatus
    if (instance.isActive !== undefined) result.is_active = instance.isActive
    if (instance.notes !== undefined) result.notes = instance.notes
    if (instance.createdAt !== undefined) result.created_at = instance.createdAt
    if (instance.updatedAt !== undefined) result.updated_at = instance.updatedAt

    return result
  }

  /**
   * Transform snake_case database columns to camelCase TypeScript properties
   */
  private static transformFromDatabase(instance: any): any {
    return {
      idAuto: instance.id_auto,
      id: instance.id,
      plantId: instance.plant_id,
      nickname: instance.nickname,
      acquisitionDate: instance.acquisition_date,
      acquisitionSource: instance.acquisition_source,
      potSize: instance.pot_size,
      location: instance.location,
      sunType: instance.sun_type,
      sunStrength: instance.sun_strength,
      healthStatus: instance.health_status,
      isActive: instance.is_active,
      notes: instance.notes,
      createdAt: instance.created_at,
      updatedAt: instance.updated_at,
    }
  }

  /**
   * Transform PlantInstanceWithPlant data including nested plant
   */
  private static transformInstanceWithPlant(instance: any): any {
    const transformedInstance = this.transformFromDatabase(instance)

    // Transform nested plant data if it exists
    if (instance.plant) {
      transformedInstance.plant = {
        idAuto: instance.plant.id_auto,
        id: instance.plant.id,
        scientificName: instance.plant.scientific_name,
        englishName: instance.plant.english_name,
        spanishName: instance.plant.spanish_name,
        hebrewName: instance.plant.hebrew_name,
        recommendedLight: instance.plant.recommended_light,
        recommendedSoil: instance.plant.recommended_soil,
        recommendedSoilAiriness: instance.plant.recommended_soil_airiness,
        recommendedSoilPh: instance.plant.recommended_soil_ph,
        recommendedSoilMoisture: instance.plant.recommended_soil_moisture,
        recommendedWatering: instance.plant.recommended_watering,
        recommendedWaterAmount: instance.plant.recommended_water_amount,
        recommendedFertilizer: instance.plant.recommended_fertilizer,
        recommendedFlowering: instance.plant.recommended_flowering,
        notes: instance.plant.notes,
        careDifficulty: instance.plant.care_difficulty,
        createdAt: instance.plant.created_at,
        updatedAt: instance.plant.updated_at,
      }
    }

    return transformedInstance
  }
  /**
   * Get all plant instances (your personal plants)
   */
  static async getAll(): Promise<PlantInstanceWithPlant[]> {
    const { data, error } = await supabase
      .from('plant_instances')
      .select(`
        *,
        plant:plants(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(instance => this.transformInstanceWithPlant(instance))
  }

  /**
   * Get plant instances by location (e.g., 'big balcony')
   */
  static async getBy({ location }: { location: Location }): Promise<PlantInstanceWithPlant[]> {
    const { data, error } = await supabase
      .from('plant_instances')
      .select(`
        *,
        plant:plants(*)
      `)
      .eq('location', location)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(instance => this.transformInstanceWithPlant(instance))
  }

  /**
   * Get plant instances by health status
   */
  static async getByHealth(status: HealthStatus): Promise<PlantInstanceWithPlant[]> {
    const { data, error } = await supabase
      .from('plant_instances')
      .select(`
        *,
        plant:plants(*)
      `)
      .eq('health_status', status)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(instance => this.transformInstanceWithPlant(instance))
  }

  /**
   * Get a single plant instance by ID
   */
  static async getById(id: string): Promise<PlantInstanceWithPlant | null> {
    const { data, error } = await supabase
      .from('plant_instances')
      .select(`
        *,
        plant:plants(*)
      `)
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data ? this.transformInstanceWithPlant(data) : null
  }

  /**
   * Get a plant instance with full history (care events, photos)
   */
  static async getWithHistory(id: string): Promise<PlantInstanceWithHistory | null> {
    const { data, error } = await supabase
      .from('plant_instances')
      .select(`
        *,
        plant:plants(*),
        careEvents:plant_care_events(*),
        photos:plant_photos(*),
        mainPhoto:plant_photos!inner(*)
      `)
      .eq('id', id)
      .eq('plant_photos.is_main_photo', true)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data || null
  }

  /**
   * Create a new plant instance (add a plant to your collection)
   */
  static async create(instance: InsertPlantInstance): Promise<PlantInstance> {
    console.log('🐛 Creating plant instance with data:', instance)
    const dbInstance = this.transformToDatabase(instance)
    console.log('🐛 Transformed for database:', dbInstance)

    const { data, error } = await supabase
      .from('plant_instances')
      .insert(dbInstance)
      .select()
      .single()

    if (error) {
      console.error('🐛 Database error:', error)
      throw error
    }
    return this.transformFromDatabase(data)
  }

  /**
   * Update an existing plant instance
   */
  static async update(id: string, updates: Partial<InsertPlantInstance>): Promise<PlantInstance> {
    const dbUpdates = this.transformToDatabase({
      ...updates,
      updatedAt: new Date().toISOString(),
    })
    const { data, error } = await supabase
      .from('plant_instances')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return this.transformFromDatabase(data)
  }

  /**
   * Mark a plant instance as inactive (plant died or was given away)
   */
  static async deactivate(id: string): Promise<PlantInstance> {
    return this.update(id, { isActive: false })
  }

  /**
   * Update plant health status
   */
  static async updateHealth(id: string, healthStatus: HealthStatus): Promise<PlantInstance> {
    return this.update(id, { healthStatus })
  }

  /**
   * Move plant to new location
   */
  static async move(id: string, newLocation: Location): Promise<PlantInstance> {
    return this.update(id, { location: newLocation })
  }

  /**
   * Get plants that need attention (struggling, sick, or haven't been watered recently)
   */
  static async getNeedingAttention(): Promise<PlantInstanceWithPlant[]> {
    const { data, error } = await supabase
      .from('plant_instances')
      .select(`
        *,
        plant:plants(*)
      `)
      .in('health_status', ['struggling', 'sick'])
      .eq('is_active', true)
      .order('health_status', { ascending: false })

    if (error) throw error
    return (data || []).map(instance => this.transformInstanceWithPlant(instance))
  }
}