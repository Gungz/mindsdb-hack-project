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

async function runEvaluation() {
let connection;
  
  try {
    console.log('🔌 Connecting to MindsDB...');
    connection = await mysql.createConnection(mindsdbConfig);
    console.log('✅ Connected to MindsDB successfully!');

    console.log('🔍 Running evaluation...');
    const evalSQL = await fs.readFile(path.join(__dirname, 'eval_kb.sql'), 'utf8');
    const evalStatements = evalSQL.split(';').filter(stmt => stmt.trim());
    const [results] = await connection.execute(evalStatements[0]);
    
    console.log('\n📊 KB Evaluation Summary:');
    console.log(`🔗 Evaluation results: ${results.length}`);
    results.forEach(result => {
      console.log(`Result for ${result.name}: \n Average relevancy: ${result.avg_relevancy} \n Average relevance score by k: ${result.avg_relevance_score_by_k} \n Average first relevant position: ${result.avg_first_relevant_position} \n Mean MRR: ${result.mean_mrr} \n Hit at k: ${result.hit_at_k} \n Bin precision at k: ${result.bin_precision_at_k} \n Average entropy: ${result.avg_entropy} \n Average NDCG: ${result.avg_ndcg} \n Average query time: ${result.avg_query_time}`);
    });

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

runEvaluation().then(() => {
  console.log('\n🎉 KB Evaluation completed successfully!');
}).catch(error => {
  console.error('💥 KB Evaluation failed:', error);
  process.exit(1);
});