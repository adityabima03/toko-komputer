import mysql from 'mysql2/promise';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL belum diset');

const pool = await mysql.createPool(process.env.DATABASE_URL);
const [rows] = await pool.query<{ id: string; name: string; image: string }[]>(
	'SELECT id, name, image FROM products ORDER BY id'
);

const products = rows as { id: string; name: string; image: string }[];
const byImage = new Map<string, { id: string; name: string }[]>();

for (const row of products) {
	const list = byImage.get(row.image) ?? [];
	list.push({ id: row.id, name: row.name });
	byImage.set(row.image, list);
}

const dupes = [...byImage.entries()].filter(([, list]) => list.length > 1);

console.log(`Total produk: ${products.length}`);
console.log(`URL gambar unik: ${byImage.size}`);
console.log(`Gambar dobel: ${dupes.length}`);

for (const [url, list] of dupes) {
	console.log('\n---');
	console.log(url);
	for (const item of list) console.log(`  ${item.id} | ${item.name}`);
}

await pool.end();
