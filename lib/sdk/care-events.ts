import { supabase } from '@/lib/supabase'
import type {
  PlantCareEvent,
  InsertPlantCareEvent,
  CareEventType,
} from '@/db/types'

export class CareEventsSDK {
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
    const careEvent: InsertPlantCareEvent = {
      plantInstanceId,
      eventType: event.type,
      eventDate: new Date().toISOString().split('T')[0], // Today's date
      notes: event.notes,
      waterAmount: event.waterAmount,
      fertilizerType: event.fertilizerType,
      photoUrls: event.photoUrls,
    }

    const { data, error } = await supabase
      .from('plant_care_events')
      .insert(careEvent)
      .select()
      .single()

    if (error) throw error

    // Update plant instance's updated_at timestamp to track last activity
    await supabase
      .from('plant_instances')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', plantInstanceId)

    return data
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
    return data || []
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