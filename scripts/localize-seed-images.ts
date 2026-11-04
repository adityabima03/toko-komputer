/**
 * Ubah image di seed.ts jadi path lokal /products/{id}.jpg
 * Jalankan: bunx tsx scripts/localize-seed-images.ts
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const seedPath = path.join(process.cwd(), 'scripts', 'seed.ts');
let src = readFileSync(seedPath, 'utf8');

const re = /id:\s*'(p_\d+)'([\s\S]*?)image:\s*'([^']*)'/g;
let changed = 0;
src = src.replace(re, (full, id: string, mid: string, oldUrl: string) => {
	const next = `/api/products/${id}/image`;
	if (oldUrl === next) return full;
	changed += 1;
	return `id: '${id}'${mid}image: '${next}'`;
});

writeFileSync(seedPath, src);
console.log(`seed.ts image dilokalkan: ${changed}`);
