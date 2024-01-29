import knex, { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const mysqlConfig: Knex.MySql2ConnectionConfig = {
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  multipleStatements: false,
  namedPlaceholders: true,
  rowsAsArray: false,
  dateStrings: true,
};

const poolConfig: Knex.PoolConfig = {
  min: 0,
  max: 10,
  idleTimeoutMillis: 60000,
};

// TODO: configure migrations: Knex.MigratorConfig;

const knexConfig: Knex.Config = {
  client: 'mysql2',
  version: '8.2.0',
  connection: mysqlConfig,
  pool: poolConfig,
  acquireConnectionTimeout: 30000,
  asyncStackTraces: true,
  compileSqlOnError: true,
  debug: process.env.NODE_ENV === 'development',
};

export const knexx = knex(knexConfig);
