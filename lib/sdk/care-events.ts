import { supabase } from '@/lib/supabase'
import type {
  PlantCareEvent,
  InsertPlantCareEvent,
  CareEventType,
} from '@/db/types'

export class CareEventsSDK {
  /**
   * Transform camelCase TypeScript properties to snake_case database columns
   */
  private static transformToDatabase(event: any): any {
    const result: any = {}

    if (event.id !== undefined) result.id = event.id
    if (event.plantInstanceId !== undefined) result.plant_instance_id = event.plantInstanceId
    if (event.eventType !== undefined) result.event_type = event.eventType
    if (event.eventDate !== undefined) result.event_date = event.eventDate
    if (event.notes !== undefined) result.notes = event.notes
    if (event.waterAmount !== undefined) result.water_amount = event.waterAmount
    if (event.fertilizerType !== undefined) result.fertilizer_type = event.fertilizerType
    if (event.photoUrls !== undefined) result.photo_urls = event.photoUrls
    if (event.createdAt !== undefined) result.created_at = event.createdAt
    if (event.updatedAt !== undefined) result.updated_at = event.updatedAt

    return result
  }

  /**
   * Transform snake_case database columns to camelCase TypeScript properties
   */
  private static transformFromDatabase(event: any): any {
    return {
      idAuto: event.id_auto,
      id: event.id,
      plantInstanceId: event.plant_instance_id,
      eventType: event.event_type,
      eventDate: event.event_date,
      notes: event.notes,
      waterAmount: event.water_amount,
      fertilizerType: event.fertilizer_type,
      photoUrls: event.photo_urls,
      createdAt: event.created_at,
      updatedAt: event.updated_at,
    }
  }

  /**
   * Log a new care event
   */
  static async log(
    plantInstanceId: string,
    event: {
      type: CareEventType
      notes?: string
      waterAmount?: string
      fertilizerType?: string
      photoUrls?: string[]
    }
  ): Promise<PlantCareEvent> {
    const careEvent = {
      plantInstanceId,
      eventType: event.type,
      eventDate: new Date().toISOString().split('T')[0], // Today's date
      notes: event.notes,
      waterAmount: event.waterAmount,
      fertilizerType: event.fertilizerType,
      photoUrls: event.photoUrls,
    }

    const dbCareEvent = this.transformToDatabase(careEvent)
    console.log('🐛 Care event for database:', dbCareEvent)

    const { data, error } = await supabase
      .from('plant_care_events')
      .insert(dbCareEvent)
      .select()
      .single()

    if (error) {
      console.error('🐛 Care event insert error:', error)
      throw error
    }

    // Update plant instance's updated_at timestamp to track last activity
    await supabase
      .from('plant_instances')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', plantInstanceId)

    return this.transformFromDatabase(data)
  }

  /**
   * Get care events for a specific plant instance
   */
  static async getForPlant(
    plantInstanceId: string,
    limit = 50
  ): Promise<PlantCareEvent[]> {
    const { data, error } = await supabase
      .from('plant_care_events')
      .select('*')
      .eq('plant_instance_id', plantInstanceId)
      .order('event_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return (data || []).map(event => this.transformFromDatabase(event))
  }

  /**
   * Get recent care events across all plants
   */
  static async getRecent(limit = 20): Promise<PlantCareEvent[]> {
    const { data, error } = await supabase
      .from('plant_care_events')
      .select(`
        *,
        plant_instance:plant_instances(
          nickname,
          plant:plants(english_name, scientific_name)
        )
      `)
      .order('event_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }

  /**
   * Get care events by type (e.g., all watering events)
   */
  static async getByType(
    eventType: CareEventType,
    limit = 50
  ): Promise<PlantCareEvent[]> {
    const { data, error } = await supabase
      .from('plant_care_events')
      .select(`
        *,
        plant_instance:plant_instances(
          nickname,
          plant:plants(english_name, scientific_name)
        )
      `)
      .eq('event_type', eventType)
      .order('event_date', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }

  /**
   * Get last watering date for a plant instance
   */
  static async getLastWatering(plantInstanceId: string): Promise<Date | null> {
    const { data, error } = await supabase
      .from('plant_care_events')
      .select('event_date')
      .eq('plant_instance_id', plantInstanceId)
      .eq('event_type', 'water')
      .order('event_date', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data ? new Date(data.event_date) : null
  }

  /**
   * Get care statistics for a plant instance
   */
  static async getStats(plantInstanceId: string): Promise<{
    totalEvents: number
    wateringCount: number
    fertilizerCount: number
    lastWatering: Date | null
    lastFertilizer: Date | null
  }> {
    const [totalEvents, wateringEvents, fertilizerEvents] = await Promise.all([
      // Total events
      supabase
        .from('plant_care_events')
        .select('id', { count: 'exact', head: true })
        .eq('plant_instance_id', plantInstanceId),

      // Watering events
      supabase
        .from('plant_care_events')
        .select('event_date')
        .eq('plant_instance_id', plantInstanceId)
        .eq('event_type', 'water')
        .order('event_date', { ascending: false }),

      // Fertilizer events
      supabase
        .from('plant_care_events')
        .select('event_date')
        .eq('plant_instance_id', plantInstanceId)
        .eq('event_type', 'fertilizer')
        .order('event_date', { ascending: false }),
    ])

    if (totalEvents.error) throw totalEvents.error
    if (wateringEvents.error) throw wateringEvents.error
    if (fertilizerEvents.error) throw fertilizerEvents.error

    return {
      totalEvents: totalEvents.count || 0,
      wateringCount: wateringEvents.data?.length || 0,
      fertilizerCount: fertilizerEvents.data?.length || 0,
      lastWatering: wateringEvents.data?.[0]?.event_date
        ? new Date(wateringEvents.data[0].event_date)
        : null,
      lastFertilizer: fertilizerEvents.data?.[0]?.event_date
        ? new Date(fertilizerEvents.data[0].event_date)
        : null,
    }
  }

  /**
   * Update a care event
   */
  static async update(
    id: string,
    updates: Partial<InsertPlantCareEvent>
  ): Promise<PlantCareEvent> {
    const { data, error } = await supabase
      .from('plant_care_events')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * Delete a care event
   */
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('plant_care_events')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}