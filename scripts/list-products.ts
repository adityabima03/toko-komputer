import mysql from 'mysql2/promise';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL belum diset');

const pool = await mysql.createPool(process.env.DATABASE_URL);
const [cats] = await pool.query('SELECT slug, name, group_name FROM categories ORDER BY sort_order');
const [products] = await pool.query(
	'SELECT id, name, slug, category, brand, price, stock FROM products ORDER BY id'
);
console.log('CATEGORIES');
console.log(JSON.stringify(cats, null, 2));
console.log('PRODUCTS');
console.log(JSON.stringify(products, null, 2));
await pool.end();
