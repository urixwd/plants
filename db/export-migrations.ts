#!/usr/bin/env bun

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, resolve } from 'path';

/**
 * Script to export all SQL migration files into a single consolidated file
 * Usage: bun run export-migrations.ts [output-file]
 */

async function exportMigrations() {
  const migrationsDir = resolve(__dirname, 'src/migrations');
  const outputFile = process.argv[2] || 'consolidated-migrations.sql';
  
  try {
    // Read all files in migrations directory
    const files = await readdir(migrationsDir);
    
    // Filter for SQL files and sort them
    const sqlFiles = files
      .filter(file => file.endsWith('.sql'))
      .sort(); // This will sort lexicographically, which works for numbered files
    
    if (sqlFiles.length === 0) {
      console.log('No SQL migration files found in', migrationsDir);
      return;
    }
    
    console.log(`Found ${sqlFiles.length} migration files:`);
    sqlFiles.forEach(file => console.log(`  - ${file}`));
    
    // Read and concatenate all SQL files
    let consolidatedSQL = `-- Consolidated Database Migrations
-- Generated on: ${new Date().toISOString()}
-- Total files: ${sqlFiles.length}

`;
    
    for (const file of sqlFiles) {
      const filePath = join(migrationsDir, file);
      const content = await readFile(filePath, 'utf-8');
      
      consolidatedSQL += `-- ============================================
-- File: ${file}
-- ============================================

${content}

`;
    }
    
    // Write consolidated file
    const outputPath = resolve(__dirname, outputFile);
    await writeFile(outputPath, consolidatedSQL, 'utf-8');
    
    console.log(`\n✅ Successfully exported ${sqlFiles.length} migration files to: ${outputPath}`);
    console.log(`📄 Total size: ${(consolidatedSQL.length / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('❌ Error exporting migrations:', error);
    process.exit(1);
  }
}

// Run the script
exportMigrations();
