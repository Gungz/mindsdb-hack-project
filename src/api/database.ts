import mysql from 'mysql2/promise';
import { mindsdbConfig, mysqlConfig } from '../config/mindsdb';

let connection: mysql.Connection | null = null;
let mindsdbConnection: mysql.Connection | null = null;

export async function getDBConnection() {
  if (!connection) {
    connection = await mysql.createConnection(/*{
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: 'root',
      database: 'hackathon'
    }*/{
      host: mysqlConfig.host,
      port: Number(mysqlConfig.port),
      user: mysqlConfig.username,
      password: mysqlConfig.password,
      database: mysqlConfig.database
    });
  }
  return connection;
}

export async function closeDBConnection() {
  if (connection) {
    await connection.end();
    connection = null;
  }
}

export async function getMindsDBConnection() {
  if (!mindsdbConnection) {
    mindsdbConnection = await mysql.createConnection(/*{
      host: '127.0.0.1',
      port: 47335,
      user: 'mindsdb',
      password: '',
      database: 'mindsdb',
      ssl: {
        rejectUnauthorized: false
      }
    }*/{
      host: mindsdbConfig.host,
      port: Number(mindsdbConfig.port),
      user: mindsdbConfig.username,
      password: mindsdbConfig.password,
      database: mindsdbConfig.database,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }
  return mindsdbConnection;
}

export async function closeMindsDBConnection() {
  if (mindsdbConnection) {
    await mindsdbConnection.end();
    mindsdbConnection = null;
  }
}