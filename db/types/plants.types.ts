import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  plants,
  plantInstances,
  plantCareEvents,
  plantPhotos,
} from "../schema/plants.schema";

// Plant types
export type Plant = InferSelectModel<typeof plants>;
export type InsertPlant = InferInsertModel<typeof plants>;

// Plant instance types
export type PlantInstance = InferSelectModel<typeof plantInstances>;
export type InsertPlantInstance = InferInsertModel<typeof plantInstances>;

// Plant care event types
export type PlantCareEvent = InferSelectModel<typeof plantCareEvents>;
export type InsertPlantCareEvent = InferInsertModel<typeof plantCareEvents>;

// Plant photo types
export type PlantPhoto = InferSelectModel<typeof plantPhotos>;
export type InsertPlantPhoto = InferInsertModel<typeof plantPhotos>;

// Enum types for better type safety
export type PotSize = "xs" | "s" | "m" | "l" | "xl";
export type Location =
  | "big balcony"
  | "small balcony"
  | "living room"
  | "kitchen"
  | "dining room"
  | "entrance"
  | "hall"
  | "office"
  | "goni bathroom"
  | "goni bedroom"
  | "goni balcony"
  | "parent bathroom"
  | "parent bedroom";
export type SunType = "direct" | "indirect";
export type HealthStatus = "healthy" | "struggling" | "sick" | "dead";
export type CareDifficulty = "easy" | "medium" | "difficult";
export type CareEventType =
  | "water"
  | "fertilizer"
  | "pruning"
  | "repot"
  | "change_soil"
  | "trim"
  | "pest_treatment"
  | "move_location"
  | "other";

// Composite types for API responses
export type PlantWithInstance = Plant & {
  instances: PlantInstance[];
};

export type PlantInstanceWithPlant = PlantInstance & {
  plant: Plant;
};

export type PlantInstanceWithHistory = PlantInstance & {
  plant: Plant;
  careEvents: PlantCareEvent[];
  photos: PlantPhoto[];
  mainPhoto?: PlantPhoto;
};
