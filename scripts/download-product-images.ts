/**
 * Unduh gambar produk ke static/products/ dan simpan path lokal di DB.
 * Jalankan: bunx tsx --env-file=.env scripts/download-product-images.ts
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL belum diset');

const EXT_BY_TYPE: Record<string, string> = {
	'image/jpeg': 'jpg',
	'image/jpg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp',
	'image/gif': 'gif'
};

const outDir = path.join(process.cwd(), 'static', 'products');
await mkdir(outDir, { recursive: true });

const pool = await mysql.createPool(process.env.DATABASE_URL);
const [rows] = await pool.query<{ id: string; image: string }[]>(
	'SELECT id, image FROM products ORDER BY id'
);
const products = rows as { id: string; image: string }[];

let ok = 0;
let skip = 0;
let fail = 0;

for (const product of products) {
	if (product.image.startsWith('/products/')) {
		skip += 1;
		continue;
	}
	if (!/^https?:\/\//i.test(product.image)) {
		console.warn(`Lewati ${product.id}: bukan URL remote (${product.image})`);
		skip += 1;
		continue;
	}

	try {
		const res = await fetch(product.image, {
			headers: { 'User-Agent': 'toko-komputer-image-sync/1.0' }
		});
		if (!res.ok) throw new Error(`HTTP ${res.status}`);

		const contentType = (res.headers.get('content-type') || 'image/jpeg').split(';')[0].trim();
		const ext = EXT_BY_TYPE[contentType] || 'jpg';
		const filename = `${product.id}.${ext}`;
		const buffer = Buffer.from(await res.arrayBuffer());
		await writeFile(path.join(outDir, filename), buffer);

		const localPath = `/products/${filename}`;
		await pool.query('UPDATE products SET image = ? WHERE id = ?', [localPath, product.id]);
		ok += 1;
		console.log(`${product.id} -> ${localPath} (${buffer.length} byte)`);
	} catch (err) {
		fail += 1;
		console.error(`${product.id} gagal:`, err instanceof Error ? err.message : err);
	}
}

console.log(`Selesai. unduh=${ok} lewati=${skip} gagal=${fail}`);
await pool.end();
