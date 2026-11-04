/**
 * Ganti URL remote yang 404, lalu unduh ke static/products/.
 * Jalankan: bunx tsx --env-file=.env scripts/fix-broken-remote-images.ts
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL belum diset');

/** URL cadangan unik untuk id yang gagal unduh (belum dipakai produk lain). */
const FALLBACKS: Record<string, string> = {
	p_2: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=600&fit=crop&q=80',
	p_55: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&q=80',
	p_56: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&h=600&fit=crop&q=80',
	p_57: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=600&fit=crop&q=80',
	p_60: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=800&h=600&fit=crop&q=80',
	p_64: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop&q=80',
	p_66: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&q=80',
	p_68: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&h=600&fit=crop&q=80',
	p_69: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop&q=80'
};

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

for (const [id, url] of Object.entries(FALLBACKS)) {
	const res = await fetch(url, {
		headers: { 'User-Agent': 'toko-komputer-image-sync/1.0' }
	});
	if (!res.ok) {
		console.error(`${id} fallback juga gagal: HTTP ${res.status}`);
		continue;
	}

	const contentType = (res.headers.get('content-type') || 'image/jpeg').split(';')[0].trim();
	const ext = EXT_BY_TYPE[contentType] || 'jpg';
	const filename = `${id}.${ext}`;
	const buffer = Buffer.from(await res.arrayBuffer());
	await writeFile(path.join(outDir, filename), buffer);

	const localPath = `/products/${filename}`;
	await pool.query('UPDATE products SET image = ? WHERE id = ?', [localPath, id]);
	console.log(`${id} -> ${localPath} (${buffer.length} byte)`);
}

const [check] = await pool.query<{ remote: number }[]>(
	`SELECT COUNT(*) AS remote FROM products WHERE image LIKE 'http%'`
);
console.log('Sisa URL remote di DB:', (check as { remote: number }[])[0]?.remote ?? check);
await pool.end();
