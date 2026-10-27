import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { DATABASE_URL } from '$app/env/private';
import * as schema from './schema.js';

const pool = mysql.createPool(DATABASE_URL);

export const db = drizzle(pool, { schema, mode: 'default' });
