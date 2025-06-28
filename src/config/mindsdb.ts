export const mindsdbConfig = {
  host: process.env.VITE_MINDSDB_HOST || '127.0.0.1',
  port: process.env.VITE_MINDSDB_PORT || 47335,
  username: process.env.VITE_MINDSDB_USERNAME || 'mindsdb',
  password: process.env.VITE_MINDSDB_PASSWORD || '',
  database: process.env.VITE_MINDSDB_DATABASE || 'mindsdb',
  ssl: true
};

export const mysqlConfig = {
  host: process.env.VITE_MYSQL_HOST || '127.0.0.1',
  port: process.env.VITE_MYSQL_PORT || 3306,
  username: process.env.VITE_MYSQL_USERNAME || 'root',
  password: process.env.VITE_MYSQL_PASSWORD || 'root',
  database: process.env.VITE_MYSQL_DATABASE || 'hackathon'
};

export const createMindsDBConnection = () => {
  // This will be used to establish connection to MindsDB
  const connectionString = `mysql://${mindsdbConfig.username}:${mindsdbConfig.password}@${mindsdbConfig.host}:${mindsdbConfig.port}/${mindsdbConfig.database}`;
  return connectionString;
};