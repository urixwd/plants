import { supabase } from '@/lib/supabase'
import type {
  Plant,
  InsertPlant,
  PlantWithInstance,
} from '@/db/types'

export class PlantsSDK {
  /**
   * Transform snake_case database columns to camelCase TypeScript properties
   */
  private static transformPlant(plant: any): Plant {
    return {
      idAuto: plant.id_auto,
      id: plant.id,
      scientificName: plant.scientific_name,
      englishName: plant.english_name,
      spanishName: plant.spanish_name,
      hebrewName: plant.hebrew_name,
      recommendedLight: plant.recommended_light,
      recommendedSoil: plant.recommended_soil,
      recommendedSoilAiriness: plant.recommended_soil_airiness,
      recommendedSoilPh: plant.recommended_soil_ph,
      recommendedSoilMoisture: plant.recommended_soil_moisture,
      recommendedWatering: plant.recommended_watering,
      recommendedWaterAmount: plant.recommended_water_amount,
      recommendedFertilizer: plant.recommended_fertilizer,
      recommendedFlowering: plant.recommended_flowering,
      notes: plant.notes,
      careDifficulty: plant.care_difficulty,
      createdAt: plant.created_at,
      updatedAt: plant.updated_at,
    }
  }
  /**
   * Get all plants from the botanical database
   */
  static async getAll(): Promise<Plant[]> {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .order('english_name', { ascending: true })

    if (error) throw error
    return (data || []).map(plant => this.transformPlant(plant))
  }

  /**
   * Get a single plant by ID
   */
  static async getById(id: string): Promise<Plant | null> {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data ? this.transformPlant(data) : null
  }

  /**
   * Get a plant with all its instances
   */
  static async getWithInstances(id: string): Promise<PlantWithInstance | null> {
    const { data: plant, error: plantError } = await supabase
      .from('plants')
      .select(`
        *,
        instances:plant_instances(*)
      `)
      .eq('id', id)
      .single()

    if (plantError && plantError.code !== 'PGRST116') throw plantError
    return plant || null
  }

  /**
   * Search plants by name (scientific or common names)
   */
  static async search(query: string): Promise<Plant[]> {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .or(`scientific_name.ilike.%${query}%,english_name.ilike.%${query}%,spanish_name.ilike.%${query}%,hebrew_name.ilike.%${query}%`)
      .order('english_name', { ascending: true })

    if (error) throw error
    return (data || []).map(plant => this.transformPlant(plant))
  }

  /**
   * Create a new plant in the botanical database
   */
  static async create(plant: InsertPlant): Promise<Plant> {
    const { data, error } = await supabase
      .from('plants')
      .insert(plant)
      .select()
      .single()

    if (error) throw error
    return this.transformPlant(data)
  }

  /**
   * Update an existing plant
   */
  static async update(id: string, updates: Partial<InsertPlant>): Promise<Plant> {
    const { data, error } = await supabase
      .from('plants')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return this.transformPlant(data)
  }

  /**
   * Delete a plant (will cascade delete all instances)
   */
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('plants')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}