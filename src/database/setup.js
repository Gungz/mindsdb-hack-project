// MindsDB Database Setup Script
// Run this script to initialize the database with tables and seed data

import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MindsDB connection configuration
const mindsdbConfig = {
  host: process.env.MINDSDB_HOST || '127.0.0.1',
  port: process.env.MINDSDB_PORT || '47335',
  user: process.env.MINDSDB_USERNAME || 'mindsdb',
  password: process.env.MINDSDB_PASSWORD || '',
  database: process.env.MINDSDB_DATABASE || 'mindsdb',
  ssl: {
    rejectUnauthorized: false
  }
};

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔌 Connecting to MindsDB...');
    connection = await mysql.createConnection(mindsdbConfig);
    console.log('✅ Connected to MindsDB successfully!');

    // Read and execute schema
    console.log('📋 Creating database schema...');
    const schemaSQL = await fs.readFile(path.join(__dirname, 'schema.sql'), 'utf8');
    const schemaStatements = schemaSQL.split(';').filter(stmt => stmt.trim());
    
    for (const statement of schemaStatements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }
    console.log('✅ Database schema created successfully!');

    // Read and execute seed data
    console.log('🌱 Seeding database with initial data...');
    const seedSQL = await fs.readFile(path.join(__dirname, 'seed.sql'), 'utf8');
    const seedStatements = seedSQL.split(';').filter(stmt => stmt.trim());
    
    for (const statement of seedStatements) {
      if (statement.trim()) {
        try {
          await connection.execute(statement);
        } catch (error) {
          // Ignore duplicate entry errors for seed data
          if (!error.message.includes('Duplicate entry')) {
            throw error;
          }
        }
      }
    }
    console.log('✅ Database seeded successfully!');

    // Verify the setup
    console.log('🔍 Verifying setup...');
    const [sources] = await connection.query('SELECT name, provider, is_active FROM mysql_datasource.hackathon.hackathon_sources');
    
    console.log('\n📊 Setup Summary:');
    console.log(`🔗 Hackathon Sources: ${sources.length}`);
    sources.forEach(source => {
      console.log(`   - ${source.name} (${source.provider}) - ${source.is_active ? 'Active' : 'Inactive'}`);
    });

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed.');
    }
  }
}

// Run the setup
setupDatabase().then(() => {
  console.log('\n🎉 Database setup completed successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Update your .env file with MindsDB credentials');
  console.log('2. Configure hackathon source APIs');
  console.log('3. Test functionality');
}).catch(error => {
  console.error('💥 Setup failed:', error);
  process.exit(1);
});