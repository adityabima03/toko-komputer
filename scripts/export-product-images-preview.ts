/**
 * Export BLOB gambar ke .tmp/product-preview untuk dicek.
 * Jalankan: bunx tsx --env-file=.env scripts/export-product-images-preview.ts
 */
import { mkdir, writeFile, writeFile as write } from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL belum diset');

const outDir = path.join(process.cwd(), '.tmp', 'product-preview');
await mkdir(outDir, { recursive: true });

const pool = await mysql.createPool(process.env.DATABASE_URL);
const [rows] = await pool.query<
	{ id: string; name: string; category: string; brand: string; mime: string; data: Buffer }[]
>(
	`SELECT p.id, p.name, p.category, p.brand, i.mime, i.data
	 FROM products p
	 JOIN product_images i ON i.product_id = p.id
	 ORDER BY p.id`
);

const products = rows as {
	id: string;
	name: string;
	category: string;
	brand: string;
	mime: string;
	data: Buffer;
}[];

const manifest: { id: string; name: string; category: string; brand: string; file: string }[] = [];

for (const p of products) {
	const ext = p.mime.includes('png') ? 'png' : p.mime.includes('webp') ? 'webp' : 'jpg';
	const file = `${p.id}.${ext}`;
	await writeFile(path.join(outDir, file), p.data);
	manifest.push({
		id: p.id,
		name: p.name,
		category: p.category,
		brand: p.brand,
		file
	});
}

await write(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
console.log(`Export ${manifest.length} gambar ke ${outDir}`);
await pool.end();
