/**
 * Application configuration
 */

// Safe logging function that works during build time
const safeLog = (message: string) => {
  if (typeof window !== "undefined" || process.env.NODE_ENV === "development") {
    console.debug(message);
  }
};

safeLog(`process.env.APP_ENV: ${process.env.APP_ENV}`);

// Define environment types
export type Environment = "development" | "production" | "staging" | "test";

/**
 * Simple configuration object with only what's needed across the app
 */
interface Config {
  publicApiUrl: string;
  environment: Environment;
}

// Use APP_ENV exclusively for environment detection
const appEnv = process.env.APP_ENV;
safeLog(`appEnv: ${appEnv}`);
const environment = (appEnv || "development") as Environment;

// Log the environment detection
safeLog(
  `Web config initialized with APP_ENV: "${appEnv}", resolved as environment: "${environment}"`
);

// check if environment is valid
if (!["development", "staging", "production"].includes(environment)) {
  throw new Error(`Invalid environment: "${environment}"`);
}

// our .env curretly contains. add to the config object:
// APP_ENV=development
// DATABASE_URL=postgresql://postgres.pcpdesdlwdzjvvujnhsz:DBDn938iYcFxVf14BP@aws-1-eu-central-1.pooler.supabase.com:6543/postgres
// # Supabase
// SUPABASE_PROJECT_ID=pcpdesdlwdzjvvujnhsz
// SUPABASE_URL=https://pcpdesdlwdzjvvujnhsz.supabase.co
// SUPABASE_PUBLISHABLE_KEY=sb_publishable_VRKY7SxxJpuydzKGaNP1ag_y1HZcw7h
// SUPABASE_API_SECRET_KEY=sb_secret_5EoL07XiCtHybPvEqgxJgQ_mjYmccmR
// SUPABASE_DATA_API_URL=https://pcpdesdlwdzjvvujnhsz.supabase.co

const envs = {
  development: {
    publicApiUrl: "http://localhost:3100",
    environment,
  },
  staging: {
    publicApiUrl: "https://plants.staging.plants.online",
    environment,
  },
  production: {
    publicApiUrl: "https://plants.online",
    environment,
  },
};

// Export config object with only what's needed
export const config = envs[environment as keyof typeof envs];
