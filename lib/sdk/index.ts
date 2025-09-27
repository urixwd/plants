// Main SDK exports - centralized access to all plant data operations
export { PlantsSDK } from './plants'
export { PlantInstancesSDK } from './instances'
export { CareEventsSDK } from './care-events'
export { PhotosSDK } from './photos'

// Re-export types for convenience
export type * from '@/db/types'

// Example usage:
// import { PlantsSDK, PlantInstancesSDK } from '@/lib/sdk'
// const balconyPlants = await PlantInstancesSDK.getBy({location: 'big balcony'})
// const plantHistory = await PlantsSDK.getWithInstances(plantId)