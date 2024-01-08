import mysql, { ConnectionOptions } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const mysqlConfig: ConnectionOptions = {
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  multipleStatements: false,
  namedPlaceholders: true,
  rowsAsArray: true,
};

export const pool = mysql.createPool({
  ...mysqlConfig,
  waitForConnections: true,
  connectionLimit: 20,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
});
