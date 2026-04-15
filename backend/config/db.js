const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const isLocal = process.env.DB_HOST === 'localhost' || process.env.DB_HOST === '127.0.0.1';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD ?? ''),
  database: process.env.DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000, // Slightly longer timeout for cloud connections
  ssl: isLocal ? false : { rejectUnauthorized: false }
});

module.exports = pool;
