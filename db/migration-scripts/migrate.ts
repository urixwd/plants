// scripts/migrate.ts
import { Migrator } from './migrator';
import path from 'path';

async function main() {
  // Check for required environment variables
  if (!process.env.DATABASE_URL) {
    console.error('Missing required environment variable: DATABASE_URL');
    process.exit(1);
  }

  console.log('Starting database migration...');
  console.log(`Environment: ${process.env.APP_ENV || 'development'}`);
  console.log(`Database URL: ${process.env.DATABASE_URL}`);

  const migrator = new Migrator(path.join(process.cwd(), 'db/migrations'));

  try {
    await migrator.migrateUp();
    console.log('✨ Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

main();
