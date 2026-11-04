/**
 * Pastikan setiap produk punya URL gambar unik.
 * Jalankan: bunx tsx --env-file=.env scripts/fix-unique-images.ts
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL belum diset');

/** Satu URL unik per id produk (tema tech/komputer). */
const UNIQUE_IMAGES: Record<string, string> = {
	p_1: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=600&fit=crop&q=80',
	p_2: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555cd?w=800&h=600&fit=crop&q=80',
	p_3: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop&q=80',
	p_4: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&h=600&fit=crop&q=80',
	p_5: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop&q=80',
	p_6: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop&q=80',
	p_7: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&h=600&fit=crop&q=80',
	p_8: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&h=600&fit=crop&q=80',
	p_9: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&h=600&fit=crop&q=80',
	p_10: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=800&h=600&fit=crop&q=80',
	p_11: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop&q=80',
	p_12: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&h=600&fit=crop&q=80',
	p_13: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=800&h=600&fit=crop&q=80',
	p_14: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop&q=80',
	p_15: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&h=600&fit=crop&q=80',
	p_16: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=600&fit=crop&q=80',
	p_17: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop&q=80',
	p_18: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&h=600&fit=crop&q=80',
	p_19: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&h=600&fit=crop&q=80',
	p_20: 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=800&h=600&fit=crop&q=80',
	p_21: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&h=600&fit=crop&q=80',
	p_22: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&h=600&fit=crop&q=80',
	p_23: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&h=600&fit=crop&q=80',
	p_24: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&h=600&fit=crop&q=80',
	p_25: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/CMPSU-620HX.jpg/960px-CMPSU-620HX.jpg',
	p_26: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop&q=80',
	p_27: 'https://images.unsplash.com/photo-1754928661655-dfc041ee51c5?w=800&h=600&fit=crop&q=80',
	p_28: 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=800&h=600&fit=crop&q=80',
	p_29: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop&q=80',
	p_30: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&h=600&fit=crop&q=80',
	p_31: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&h=600&fit=crop&q=80',
	p_32: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop&q=80',
	p_33: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=600&fit=crop&q=80',
	p_34: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&h=600&fit=crop&q=80',
	p_35: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop&q=80',
	p_36: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=600&fit=crop&q=80',
	p_37: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&h=600&fit=crop&q=80',
	p_38: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=600&fit=crop&q=80',
	p_39: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=600&fit=crop&q=80',
	p_40: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80',
	p_41: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=600&fit=crop&q=80',
	p_42: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&q=80',
	p_43: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=600&fit=crop&q=80',
	p_44: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&h=600&fit=crop&q=80',
	p_45: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&h=600&fit=crop&q=80',
	p_46: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop&q=80',
	p_47: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop&q=80',
	p_48: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop&q=80',
	p_49: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop&q=80',
	p_50: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=600&fit=crop&q=80',
	p_51: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800&h=600&fit=crop&q=80',
	p_52: 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800&h=600&fit=crop&q=80',
	p_53: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop&q=80',
	p_54: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop&q=80',
	p_55: 'https://images.unsplash.com/photo-1614624532983-4ce03382d60d?w=800&h=600&fit=crop&q=80',
	p_56: 'https://images.unsplash.com/photo-1625849901923-8b7696400785?w=800&h=600&fit=crop&q=80',
	p_57: 'https://images.unsplash.com/photo-1603739903239-8b6e64cfc322?w=800&h=600&fit=crop&q=80',
	p_58: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop&q=80',
	p_59: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop&q=80',
	p_60: 'https://images.unsplash.com/photo-1635078608511-b7bbb907ed07?w=800&h=600&fit=crop&q=80',
	p_61: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=600&fit=crop&q=80',
	p_62: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&h=600&fit=crop&q=80',
	p_63: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=600&fit=crop&q=80',
	p_64: 'https://images.unsplash.com/photo-1546435770-a3e426b57678?w=800&h=600&fit=crop&q=80',
	p_65: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&h=600&fit=crop&q=80',
	p_66: 'https://images.unsplash.com/photo-1600080972464-8e4f90aa087b?w=800&h=600&fit=crop&q=80',
	p_67: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&h=600&fit=crop&q=80',
	p_68: 'https://images.unsplash.com/photo-1598331668826-20b995fd6dd5?w=800&h=600&fit=crop&q=80',
	p_69: 'https://images.unsplash.com/photo-1587825140909-1c9ddd07072d?w=800&h=600&fit=crop&q=80',
	p_70: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&q=80'
};

const urls = Object.values(UNIQUE_IMAGES);
const uniqueCount = new Set(urls).size;
if (uniqueCount !== urls.length) {
	throw new Error(`Mapping masih punya URL dobel: ${urls.length - uniqueCount} duplikat`);
}

const pool = await mysql.createPool(process.env.DATABASE_URL);
const [rows] = await pool.query<{ id: string; image: string }[]>(
	'SELECT id, image FROM products ORDER BY id'
);
const products = rows as { id: string; image: string }[];

let updated = 0;
const sqlLines: string[] = [
	'-- Pastikan setiap produk punya gambar unik',
	'USE toko_komputer;',
	''
];

for (const product of products) {
	const next = UNIQUE_IMAGES[product.id];
	if (!next) {
		console.warn(`Lewati ${product.id}: tidak ada mapping gambar`);
		continue;
	}
	if (product.image === next) continue;

	await pool.query('UPDATE products SET image = ? WHERE id = ?', [next, product.id]);
	updated += 1;
	sqlLines.push(
		`UPDATE products SET image = '${next.replace(/'/g, "''")}' WHERE id = '${product.id}';`
	);
}

sqlLines.push('');
sqlLines.push('-- Verifikasi: harus 0 baris');
sqlLines.push(`SELECT image, COUNT(*) AS jumlah, GROUP_CONCAT(id ORDER BY id) AS produk
FROM products
GROUP BY image
HAVING COUNT(*) > 1;`);

await writeFile(
	path.join(process.cwd(), 'scripts', 'fix-unique-images.sql'),
	sqlLines.join('\n') + '\n',
	'utf8'
);

const [check] = await pool.query<{ image: string; jumlah: number }[]>(
	`SELECT image, COUNT(*) AS jumlah
	 FROM products
	 GROUP BY image
	 HAVING COUNT(*) > 1`
);

console.log(`Produk di DB: ${products.length}`);
console.log(`Gambar di-update: ${updated}`);
console.log(`Sisa gambar dobel: ${(check as unknown[]).length}`);
console.log('SQL tersimpan di scripts/fix-unique-images.sql');

await pool.end();
