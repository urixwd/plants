import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  uuid,
  index,
  integer,
  date,
} from "drizzle-orm/pg-core";

export const timestampFields = {
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
};

// Plants master table - botanical information and care recommendations
export const plants = pgTable(
  "plants",
  {
    idAuto: serial("id_auto").notNull(),
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    scientificName: text("scientific_name").notNull(),
    englishName: text("english_name"),
    spanishName: text("spanish_name"),
    hebrewName: text("hebrew_name"),

    // Recommended care conditions
    recommendedLight: text("recommended_light"), // e.g. "bright indirect", "low light", "direct sun"
    recommendedSoil: text("recommended_soil"), // soil type description
    recommendedSoilAiriness: text("recommended_soil_airiness"), // אווריריות level
    recommendedSoilPh: text("recommended_soil_ph"), // e.g. "6.0-7.0", "acidic", "alkaline"
    recommendedSoilMoisture: text("recommended_soil_moisture"), // "dry", "moist", "wet"
    recommendedWatering: text("recommended_watering"), // watering schedule/instructions
    recommendedWaterAmount: text("recommended_water_amount"), // how much water
    recommendedFertilizer: text("recommended_fertilizer"), // fertilizer/feeding instructions
    recommendedFlowering: text("recommended_flowering"), // flowering information

    // Additional plant info
    notes: text("notes"), // general notes about the plant
    careDifficulty: text("care_difficulty").$type<"easy" | "medium" | "difficult">(),

    ...timestampFields,
  },
  (table) => ({
    idAutoIdx: index("plants_id_auto_idx").on(table.idAuto),
    scientificNameIdx: index("plants_scientific_name_idx").on(table.scientificName),
    englishNameIdx: index("plants_english_name_idx").on(table.englishName),
    recommendedFloweringIdx: index("plants_recommended_flowering_idx").on(table.recommendedFlowering),
    createdAtIdx: index("plants_created_at_idx").on(table.createdAt),
    updatedAtIdx: index("plants_updated_at_idx").on(table.updatedAt),
  })
);

// Plant instances - specific plants in your house
export const plantInstances = pgTable(
  "plant_instances",
  {
    idAuto: serial("id_auto").notNull(),
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    plantId: uuid("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),

    // Instance-specific info
    nickname: text("nickname"), // personal name for this specific plant
    acquisitionDate: date("acquisition_date"), // when you got this plant
    acquisitionSource: text("acquisition_source"), // where you got it from

    // Current conditions at your house
    potSize: text("pot_size").$type<"xs" | "s" | "m" | "l" | "xl">().notNull(),
    location: text("location").$type<
      | "big balcony" | "small balcony" | "living room" | "kitchen"
      | "dining room" | "entrance" | "hall" | "office"
      | "goni bathroom" | "goni bedroom" | "goni balcony"
      | "parent bathroom" | "parent bedroom"
    >().notNull(),
    sunType: text("sun_type").$type<"direct" | "indirect">().notNull(),
    sunStrength: integer("sun_strength").notNull(), // 1-5

    // Status
    isActive: boolean("is_active").notNull().default(true), // false if plant died/given away
    healthStatus: text("health_status").$type<"healthy" | "struggling" | "sick" | "dead">().default("healthy"),

    // Notes
    notes: text("notes"),

    ...timestampFields,
  },
  (table) => ({
    idAutoIdx: index("plant_instances_id_auto_idx").on(table.idAuto),
    plantIdIdx: index("plant_instances_plant_id_idx").on(table.plantId),
    locationIdx: index("plant_instances_location_idx").on(table.location),
    isActiveIdx: index("plant_instances_is_active_idx").on(table.isActive),
    healthStatusIdx: index("plant_instances_health_status_idx").on(table.healthStatus),
    createdAtIdx: index("plant_instances_created_at_idx").on(table.createdAt),
    updatedAtIdx: index("plant_instances_updated_at_idx").on(table.updatedAt),
  })
);

// Plant care events log
export const plantCareEvents = pgTable(
  "plant_care_events",
  {
    idAuto: serial("id_auto").notNull(),
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    plantInstanceId: uuid("plant_instance_id").notNull().references(() => plantInstances.id, { onDelete: "cascade" }),

    // Event details
    eventType: text("event_type").$type<
      | "water" | "fertilizer" | "pruning" | "repot" | "change_soil"
      | "trim" | "pest_treatment" | "move_location" | "other"
    >().notNull(),
    eventDate: date("event_date").notNull().defaultNow(),

    // Event-specific data
    waterAmount: text("water_amount"), // for watering events
    fertilizerType: text("fertilizer_type"), // for fertilizer events
    oldPotSize: text("old_pot_size"), // for repotting events
    newPotSize: text("new_pot_size"), // for repotting events
    oldLocation: text("old_location"), // for move events
    newLocation: text("new_location"), // for move events

    // General notes
    notes: text("notes"),

    // Photos
    photoUrls: text("photo_urls").array(), // array of photo URLs

    ...timestampFields,
  },
  (table) => ({
    idAutoIdx: index("plant_care_events_id_auto_idx").on(table.idAuto),
    plantInstanceIdIdx: index("plant_care_events_plant_instance_id_idx").on(table.plantInstanceId),
    eventTypeIdx: index("plant_care_events_event_type_idx").on(table.eventType),
    eventDateIdx: index("plant_care_events_event_date_idx").on(table.eventDate),
    createdAtIdx: index("plant_care_events_created_at_idx").on(table.createdAt),
    updatedAtIdx: index("plant_care_events_updated_at_idx").on(table.updatedAt),
    plantDateIdx: index("plant_care_events_plant_date_idx").on(table.plantInstanceId, table.eventDate),
  })
);

// Plant photos table (separate from events for general plant photos)
export const plantPhotos = pgTable(
  "plant_photos",
  {
    idAuto: serial("id_auto").notNull(),
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    plantInstanceId: uuid("plant_instance_id").notNull().references(() => plantInstances.id, { onDelete: "cascade" }),

    photoUrl: text("photo_url").notNull(),
    caption: text("caption"),
    photoDate: date("photo_date").notNull().defaultNow(),
    isMainPhoto: boolean("is_main_photo").notNull().default(false), // main photo for this plant instance

    ...timestampFields,
  },
  (table) => ({
    idAutoIdx: index("plant_photos_id_auto_idx").on(table.idAuto),
    plantInstanceIdIdx: index("plant_photos_plant_instance_id_idx").on(table.plantInstanceId),
    isMainPhotoIdx: index("plant_photos_is_main_photo_idx").on(table.isMainPhoto),
    photoDateIdx: index("plant_photos_photo_date_idx").on(table.photoDate),
    createdAtIdx: index("plant_photos_created_at_idx").on(table.createdAt),
    updatedAtIdx: index("plant_photos_updated_at_idx").on(table.updatedAt),
  })
);