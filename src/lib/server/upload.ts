import { randomBytes } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const EXT_BY_TYPE: Record<string, string> = {
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp',
	'image/gif': 'gif'
};

export async function saveProductImage(file: File) {
	const ext = EXT_BY_TYPE[file.type];
	if (!ext) throw new Error('Tipe gambar tidak didukung');

	const filename = `${Date.now()}-${randomBytes(6).toString('hex')}.${ext}`;
	const dir = path.join(process.cwd(), 'static', 'uploads', 'products');
	await mkdir(dir, { recursive: true });

	const buffer = Buffer.from(await file.arrayBuffer());
	await writeFile(path.join(dir, filename), buffer);

	return `/uploads/products/${filename}`;
}
