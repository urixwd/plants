-- Complete House Plants Database Schema

-- Plants master table - botanical information and care recommendations
CREATE TABLE plants (
    id_auto SERIAL NOT NULL,
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    scientific_name VARCHAR(256) NOT NULL,
    english_name VARCHAR(256),
    spanish_name VARCHAR(256),
    hebrew_name VARCHAR(256),
    
    -- Recommended care conditions
    recommended_light VARCHAR(100), -- e.g. "bright indirect", "low light", "direct sun"
    recommended_soil VARCHAR(256), -- soil type description
    recommended_soil_airiness VARCHAR(50), -- אווריריות level
    recommended_soil_ph VARCHAR(20), -- e.g. "6.0-7.0", "acidic", "alkaline"
    recommended_soil_moisture VARCHAR(50), -- "dry", "moist", "wet"
    recommended_watering VARCHAR(256), -- watering schedule/instructions
    recommended_water_amount VARCHAR(100), -- how much water
    recommended_fertilizer VARCHAR(256), -- fertilizer/feeding instructions
    recommended_flowering VARCHAR(256), -- flowering information
    
    -- Additional plant info
    notes TEXT, -- general notes about the plant
    care_difficulty VARCHAR(20), -- "easy", "medium", "difficult"
    
    created_at TIMESTAMP NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
    updated_at TIMESTAMP NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC')
);

-- Create indexes for plants
CREATE INDEX plants_id_auto_idx ON plants(id_auto);
CREATE INDEX plants_scientific_name_idx ON plants(scientific_name);
CREATE INDEX plants_english_name_idx ON plants(english_name);
CREATE INDEX plants_recommended_flowering_idx ON plants(recommended_flowering);
CREATE INDEX plants_created_at_idx ON plants(created_at);
CREATE INDEX plants_updated_at_idx ON plants(updated_at);

-- Create update trigger for plants
CREATE TRIGGER tr_plants_set_timestamp BEFORE
UPDATE ON plants FOR EACH ROW EXECUTE FUNCTION fn_set_timestamp();

-- Plant instances - specific plants in your house
CREATE TABLE plant_instances (
    id_auto SERIAL NOT NULL,
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    plant_id UUID NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
    
    -- Instance-specific info
    nickname VARCHAR(256), -- personal name for this specific plant
    acquisition_date DATE, -- when you got this plant
    acquisition_source VARCHAR(256), -- where you got it from
    
    -- Current conditions at your house
    pot_size VARCHAR(10) NOT NULL CHECK (pot_size IN ('xs', 's', 'm', 'l', 'xl')),
    location VARCHAR(50) NOT NULL CHECK (location IN (
        'big balcony', 'small balcony', 'living room', 'kitchen', 
        'dining room', 'entrance', 'hall', 'office', 
        'goni bathroom', 'goni bedroom', 'goni balcony',
        'parent bathroom', 'parent bedroom'
    )),
    sun_type VARCHAR(20) NOT NULL CHECK (sun_type IN ('direct', 'indirect')),
    sun_strength INTEGER NOT NULL CHECK (sun_strength >= 1 AND sun_strength <= 5),
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT true, -- false if plant died/given away
    health_status VARCHAR(20) DEFAULT 'healthy' CHECK (health_status IN ('healthy', 'struggling', 'sick', 'dead')),
    
    -- Notes
    notes TEXT,
    
    created_at TIMESTAMP NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
    updated_at TIMESTAMP NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC')
);

-- Create indexes for plant_instances
CREATE INDEX plant_instances_id_auto_idx ON plant_instances(id_auto);
CREATE INDEX plant_instances_plant_id_idx ON plant_instances(plant_id);
CREATE INDEX plant_instances_location_idx ON plant_instances(location);
CREATE INDEX plant_instances_is_active_idx ON plant_instances(is_active);
CREATE INDEX plant_instances_health_status_idx ON plant_instances(health_status);
CREATE INDEX plant_instances_created_at_idx ON plant_instances(created_at);
CREATE INDEX plant_instances_updated_at_idx ON plant_instances(updated_at);

-- Create update trigger for plant_instances
CREATE TRIGGER tr_plant_instances_set_timestamp BEFORE
UPDATE ON plant_instances FOR EACH ROW EXECUTE FUNCTION fn_set_timestamp();

-- Plant care events log
CREATE TABLE plant_care_events (
    id_auto SERIAL NOT NULL,
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    plant_instance_id UUID NOT NULL REFERENCES plant_instances(id) ON DELETE CASCADE,
    
    -- Event details
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN (
        'water', 'fertilizer', 'pruning', 'repot', 'change_soil', 
        'trim', 'pest_treatment', 'move_location', 'other'
    )),
    event_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Event-specific data
    water_amount VARCHAR(50), -- for watering events
    fertilizer_type VARCHAR(100), -- for fertilizer events
    old_pot_size VARCHAR(10), -- for repotting events
    new_pot_size VARCHAR(10), -- for repotting events
    old_location VARCHAR(50), -- for move events
    new_location VARCHAR(50), -- for move events
    
    -- General notes
    notes TEXT,
    
    -- Photos
    photo_urls TEXT[], -- array of photo URLs
    
    created_at TIMESTAMP NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
    updated_at TIMESTAMP NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC')
);

-- Create indexes for plant_care_events
CREATE INDEX plant_care_events_id_auto_idx ON plant_care_events(id_auto);
CREATE INDEX plant_care_events_plant_instance_id_idx ON plant_care_events(plant_instance_id);
CREATE INDEX plant_care_events_event_type_idx ON plant_care_events(event_type);
CREATE INDEX plant_care_events_event_date_idx ON plant_care_events(event_date);
CREATE INDEX plant_care_events_created_at_idx ON plant_care_events(created_at);
CREATE INDEX plant_care_events_updated_at_idx ON plant_care_events(updated_at);

-- Composite index for querying events by plant and date
CREATE INDEX plant_care_events_plant_date_idx ON plant_care_events(plant_instance_id, event_date DESC);

-- Create update trigger for plant_care_events
CREATE TRIGGER tr_plant_care_events_set_timestamp BEFORE
UPDATE ON plant_care_events FOR EACH ROW EXECUTE FUNCTION fn_set_timestamp();

-- Plant photos table (separate from events for general plant photos)
CREATE TABLE plant_photos (
    id_auto SERIAL NOT NULL,
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    plant_instance_id UUID NOT NULL REFERENCES plant_instances(id) ON DELETE CASCADE,
    
    photo_url TEXT NOT NULL,
    caption TEXT,
    photo_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_main_photo BOOLEAN NOT NULL DEFAULT false, -- main photo for this plant instance
    
    created_at TIMESTAMP NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
    updated_at TIMESTAMP NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC')
);

-- Create indexes for plant_photos
CREATE INDEX plant_photos_id_auto_idx ON plant_photos(id_auto);
CREATE INDEX plant_photos_plant_instance_id_idx ON plant_photos(plant_instance_id);
CREATE INDEX plant_photos_is_main_photo_idx ON plant_photos(is_main_photo);
CREATE INDEX plant_photos_photo_date_idx ON plant_photos(photo_date);
CREATE INDEX plant_photos_created_at_idx ON plant_photos(created_at);
CREATE INDEX plant_photos_updated_at_idx ON plant_photos(updated_at);

-- Create update trigger for plant_photos
CREATE TRIGGER tr_plant_photos_set_timestamp BEFORE
UPDATE ON plant_photos FOR EACH ROW EXECUTE FUNCTION fn_set_timestamp();

-- Ensure only one main photo per plant instance (each plant must have exactly one main photo)
CREATE UNIQUE INDEX plant_photos_unique_main_idx ON plant_photos(plant_instance_id) 
WHERE is_main_photo = true;