// MindsDB Database KB Evaluation Script
// Run this script to generate data for KB evaluation and evaluate it

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

async function setupEvaluation() {
let connection;
  
  try {
    console.log('🔌 Connecting to MindsDB...');
    connection = await mysql.createConnection(mindsdbConfig);
    console.log('✅ Connected to MindsDB successfully!');

    console.log('📋 KB Evaluation setup...');
    const schemaSQL = await fs.readFile(path.join(__dirname, 'eval_kb_setup.sql'), 'utf8');
    const schemaStatements = schemaSQL.split(';').filter(stmt => stmt.trim());
    
    for (const statement of schemaStatements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }
    console.log('✅ KB evaluation setup done successfully!');

  } catch (error) {
    console.error('❌ Error on KB evaluations:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed.');
    }
  }
}

// Run the setup
setupEvaluation().then(() => {
  console.log('\n🎉 KB Evaluation setup done successfully!');
}).catch(error => {
  console.error('💥 KB Evaluation failed:', error);
  process.exit(1);
});