/** @format  */

export const databaseConfiguration = {
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME || 'northwind',
};
