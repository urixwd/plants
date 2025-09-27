-- uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create timestamp update function
CREATE OR REPLACE FUNCTION fn_set_timestamp() RETURNS TRIGGER AS $$ 
BEGIN 
  NEW.updated_at = NOW() AT TIME ZONE 'UTC';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;