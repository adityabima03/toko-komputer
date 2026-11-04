/**
 * Sesuaikan nama/kategori/brand/specs produk dengan isi gambar.
 * Jalankan: bunx tsx --env-file=.env scripts/apply-product-image-matches.ts
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import mysql from 'mysql2/promise';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL belum diset');

type Match = {
	id: string;
	name: string;
	category: string;
	brand: string;
	specs: string[];
};

function slugify(name: string) {
	return name
		.toLowerCase()
		.replace(/["']/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
		.slice(0, 180);
}

const matches = JSON.parse(
	readFileSync(path.join(process.cwd(), 'scripts', 'product-image-matches.json'), 'utf8')
) as Match[];

const pool = await mysql.createPool(process.env.DATABASE_URL);
const usedSlugs = new Set<string>();

for (const m of matches) {
	let slug = slugify(m.name);
	if (usedSlugs.has(slug)) slug = `${slug}-${m.id}`;
	usedSlugs.add(slug);

	await pool.query(
		`UPDATE products
		 SET name = ?, slug = ?, category = ?, brand = ?, specs = ?
		 WHERE id = ?`,
		[m.name, slug, m.category, m.brand, JSON.stringify(m.specs), m.id]
	);

	await pool.query(
		`UPDATE order_items
		 SET product_name = ?, product_slug = ?
		 WHERE product_id = ?`,
		[m.name, slug, m.id]
	);

	console.log(`${m.id} -> ${m.category} | ${m.name}`);
}

// Sync seed.ts untuk produk yang ada di seed (p_1..p_45 biasanya)
const seedPath = path.join(process.cwd(), 'scripts', 'seed.ts');
let seed = readFileSync(seedPath, 'utf8');
let seedChanged = 0;

for (const m of matches) {
	const slug = [...usedSlugs].find((s) => s.includes(slugify(m.name).slice(0, 20))) || slugify(m.name);
	const finalSlug = slugify(m.name);
	const re = new RegExp(
		`(id:\\s*'${m.id}',\\s*\\n\\s*name:\\s*)'[^']*'([\\s\\S]*?slug:\\s*)'[^']*'([\\s\\S]*?category:\\s*)'[^']*'([\\s\\S]*?brand:\\s*)'[^']*'([\\s\\S]*?specs:\\s*)\\[[\\s\\S]*?\\]`,
		'm'
	);
	if (!re.test(seed)) continue;
	const specsLit = `[${m.specs.map((s) => `'${s.replace(/'/g, "\\'")}'`).join(', ')}]`;
	seed = seed.replace(
		re,
		`$1'${m.name.replace(/'/g, "\\'")}'$2'${finalSlug}'$3'${m.category}'$4'${m.brand}'$5${specsLit}`
	);
	seedChanged += 1;
	void slug;
}

writeFileSync(seedPath, seed);
console.log(`DB updated: ${matches.length}, seed.ts touched: ${seedChanged}`);
await pool.end();
