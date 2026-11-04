/**
 * Samakan image di seed.ts & add-products.sql dengan UNIQUE_IMAGES di fix-unique-images.ts
 * Jalankan: bunx tsx scripts/sync-unique-images-sources.ts
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

// Ambil mapping dari file fix (tanpa menjalankan update DB)
const fixSrc = readFileSync(path.join(process.cwd(), 'scripts', 'fix-unique-images.ts'), 'utf8');
const mapMatch = fixSrc.match(/const UNIQUE_IMAGES: Record<string, string> = \{([\s\S]*?)\n\};/);
if (!mapMatch) throw new Error('UNIQUE_IMAGES tidak ditemukan di fix-unique-images.ts');

const UNIQUE_IMAGES: Record<string, string> = {};
for (const m of mapMatch[1].matchAll(/p_(\d+):\s*'([^']+)'/g)) {
	UNIQUE_IMAGES[`p_${m[1]}`] = m[2];
}

function syncSeedTs(filePath: string) {
	let src = readFileSync(filePath, 'utf8');
	const re = /id:\s*'(p_\d+)'[\s\S]*?image:\s*'([^']*)'/g;
	let changed = 0;
	src = src.replace(re, (full, id: string, oldUrl: string) => {
		const next = UNIQUE_IMAGES[id];
		if (!next || next === oldUrl) return full;
		changed += 1;
		return full.replace(oldUrl, next);
	});
	writeFileSync(filePath, src);
	return changed;
}

function syncAddProductsSql(filePath: string) {
	try {
		readFileSync(filePath, 'utf8');
	} catch {
		console.log('add-products.sql tidak ada, lewati');
		return 0;
	}
	let src = readFileSync(filePath, 'utf8');
	let changed = 0;
	for (const [id, url] of Object.entries(UNIQUE_IMAGES)) {
		const re = new RegExp(`('${id}',[\\s\\S]*?)'https?://[^']*'`);
		const m = src.match(re);
		if (!m) continue;
		const next = `${m[1]}'${url}'`;
		if (m[0] === next) continue;
		src = src.replace(m[0], next);
		changed += 1;
	}
	writeFileSync(filePath, src);
	return changed;
}

const seedPath = path.join(process.cwd(), 'scripts', 'seed.ts');
const sqlPath = path.join(process.cwd(), 'scripts', 'add-products.sql');

console.log('Mapping:', Object.keys(UNIQUE_IMAGES).length);
console.log('seed.ts updated:', syncSeedTs(seedPath));
console.log('add-products.sql updated:', syncAddProductsSql(sqlPath));

const seed = readFileSync(seedPath, 'utf8');
const imgs = [...seed.matchAll(/image:\s*'([^']+)'/g)].map((x) => x[1]);
console.log('seed.ts images:', imgs.length, 'unique:', new Set(imgs).size);
