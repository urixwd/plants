/* eslint-disable */
import postgres from "postgres";
import * as path from 'path';
import * as fs from 'fs';

// Migration tracker table schema
const MIGRATION_TABLE = 'drizzle_migrations';
const CREATE_MIGRATION_TABLE = `
  CREATE TABLE IF NOT EXISTS ${MIGRATION_TABLE} (
    id SERIAL PRIMARY KEY,
    migration_name VARCHAR(255) NOT NULL,
    executed_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'UTC')
  );
`;

// Using a specific number for our advisory lock
const LOCK_ID = 'DRIZZLE_MIGRATE'.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

interface MigrationRow {
  migration_name: string;
}

export class Migrator {
  private migrationFolder: string;
  private sql: postgres.Sql<{}>;

  constructor(migrationFolder: string) {
    this.migrationFolder = migrationFolder;
    // Create raw postgres client for migrations with proper transaction settings
    this.sql = postgres(process.env.DATABASE_URL!, { 
      max: 1, // Ensure single connection
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
    });
  }

  private async acquireLock(): Promise<boolean> {
    try {
      // Try to acquire the advisory lock using the existing client
      const result = await this.sql<[{ locked: boolean }]>`
        SELECT pg_try_advisory_lock(${LOCK_ID}) as locked
      `;
      return result[0].locked;
    } catch (error) {
      await this.releaseLock();
      throw error;
    }
  }

  private async releaseLock() {
    try {
      // Release the advisory lock using the existing client
      await this.sql`
        SELECT pg_advisory_unlock(${LOCK_ID})
      `;
    } catch (error) {
      console.error('Error releasing lock:', error);
    }
  }

  async initialize() {
    // Ensure migration table exists
    await this.sql.unsafe(CREATE_MIGRATION_TABLE);
  }

  async getPendingMigrations(): Promise<string[]> {
    // Get list of all migration files
    const migrationFiles = fs
      .readdirSync(this.migrationFolder)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    // Get executed migrations
    const executedMigrations = await this.sql<MigrationRow[]>`
      SELECT migration_name FROM ${this.sql(MIGRATION_TABLE)}
    `;
    const executedSet = new Set(executedMigrations.map(m => m.migration_name));

    // Return pending migrations
    return migrationFiles.filter((f) => !executedSet.has(f));
  }

  async applyMigration(migrationName: string) {
    const migrationPath = path.join(this.migrationFolder, migrationName);
    const migrationSql = fs.readFileSync(migrationPath, 'utf-8');

    try {
      // Use a single transaction for the entire migration
      await this.sql.begin(async (sql) => {
        // Double-check this migration hasn't been applied
        const exists = await sql<[{ exists: boolean }]>`
          SELECT 1 FROM ${sql(MIGRATION_TABLE)}
          WHERE migration_name = ${migrationName}
        `;

        if (exists.length > 0) {
          console.log(`Migration ${migrationName} was already applied, skipping`);
          return;
        }

        // Apply migration
        await sql.unsafe(migrationSql);

        // Record migration
        await sql`
          INSERT INTO ${sql(MIGRATION_TABLE)} (migration_name)
          VALUES (${migrationName})
        `;

        console.log(`✅ Applied migration: ${migrationName}`);
      });
    } catch (error) {
      throw new Error(`Failed to apply migration ${migrationName}: ${error}`);
    }
  }

  async migrateUp() {
    try {
      // Try to acquire the lock
      const locked = await this.acquireLock();
      if (!locked) {
        throw new Error('Another migration process is already running');
      }

      await this.initialize();
      const pendingMigrations = await this.getPendingMigrations();

      if (pendingMigrations.length === 0) {
        console.log('No pending migrations');
        return;
      }

      console.log(`Found ${pendingMigrations.length} pending migrations`);

      for (const migration of pendingMigrations) {
        await this.applyMigration(migration);
      }
    } finally {
      // Always release the lock and close the client
      await this.releaseLock();
      await this.sql.end();
    }
  }
}
