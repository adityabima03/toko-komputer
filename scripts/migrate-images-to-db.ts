/**
 * Pindahkan static/products/* ke tabel product_images, lalu bisa dihapus dari disk.
 * Jalankan: bunx tsx --env-file=.env scripts/migrate-images-to-db.ts
 */
import { readdir, readFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL belum diset');

const MIME_BY_EXT: Record<string, string> = {
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png',
	'.webp': 'image/webp',
	'.gif': 'image/gif'
};

const dir = path.join(process.cwd(), 'static', 'products');
const pool = await mysql.createPool(process.env.DATABASE_URL);

await pool.query(`
	CREATE TABLE IF NOT EXISTS product_images (
		product_id VARCHAR(64) NOT NULL PRIMARY KEY,
		mime VARCHAR(64) NOT NULL,
		data LONGBLOB NOT NULL,
		CONSTRAINT product_images_product_id_products_id_fk
			FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
	)
`);

const files = (await readdir(dir)).filter((f) => !f.startsWith('.') && MIME_BY_EXT[path.extname(f).toLowerCase()]);
let ok = 0;
let fail = 0;

for (const file of files) {
	const productId = path.basename(file, path.extname(file));
	const mime = MIME_BY_EXT[path.extname(file).toLowerCase()];
	const data = await readFile(path.join(dir, file));
	const publicPath = `/api/products/${productId}/image`;

	try {
		await pool.query(
			`INSERT INTO product_images (product_id, mime, data) VALUES (?, ?, ?)
			 ON DUPLICATE KEY UPDATE mime = VALUES(mime), data = VALUES(data)`,
			[productId, mime, data]
		);
		await pool.query('UPDATE products SET image = ? WHERE id = ?', [publicPath, productId]);
		await pool.query(
			'UPDATE order_items SET product_image = ? WHERE product_id = ? OR product_image LIKE ?',
			[publicPath, productId, `%/products/${productId}.%`]
		);
		await unlink(path.join(dir, file));
		ok += 1;
		console.log(`${productId} -> DB (${data.length} byte), file dihapus`);
	} catch (err) {
		fail += 1;
		console.error(`${productId} gagal:`, err instanceof Error ? err.message : err);
	}
}

const [blobRows] = await pool.query<{ blobs: number }[]>(
	'SELECT COUNT(*) AS blobs FROM product_images'
);
const [pathRows] = await pool.query<{ non_api: number }[]>(
	`SELECT COUNT(*) AS non_api FROM products WHERE image NOT LIKE '/api/products/%/image'`
);
const blobs = (blobRows as { blobs: number }[])[0]?.blobs ?? 0;
const nonApi = (pathRows as { non_api: number }[])[0]?.non_api ?? 0;

console.log(`Selesai. ok=${ok} gagal=${fail} blob_di_db=${blobs} produk_non_api=${nonApi}`);
await pool.end();
