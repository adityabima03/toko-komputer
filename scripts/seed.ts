import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../src/lib/server/db/schema.ts';
import { hashPassword } from '../src/lib/server/password.ts';

const { users, sessions, categories, products } = schema;

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL belum diset di .env');

const db = drizzle(
	createClient({ url: process.env.DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN }),
	{ schema }
);

const userRows: (typeof users.$inferInsert)[] = [
	{
		id: 'u_1',
		name: 'Admin Toko',
		email: 'admin@tokokomputer.id',
		role: 'admin',
		passwordHash: hashPassword('admin123')
	},
	{
		id: 'u_2',
		name: 'Budi Santoso',
		email: 'budi@example.com',
		role: 'customer',
		passwordHash: hashPassword('budi123')
	}
];

const categoryRows: (typeof categories.$inferInsert)[] = [
	{ slug: 'laptop', name: 'Laptop' },
	{ slug: 'pc-rakitan', name: 'PC Rakitan' },
	{ slug: 'komponen', name: 'Komponen' },
	{ slug: 'monitor', name: 'Monitor' },
	{ slug: 'aksesoris', name: 'Aksesoris' },
	{ slug: 'jaringan', name: 'Jaringan' }
];

const productRows: (typeof products.$inferInsert)[] = [
	{
		id: 'p_1',
		name: 'ASUS ROG Strix G16 (2025)',
		slug: 'asus-rog-strix-g16-2025',
		category: 'laptop',
		brand: 'ASUS',
		price: 24_999_000,
		originalPrice: 27_499_000,
		rating: 4.8,
		sold: 312,
		stock: 14,
		specs: ['Intel Core i7-14650HX', 'RTX 4060 8GB', '16GB DDR5', '1TB NVMe']
	},
	{
		id: 'p_2',
		name: 'Lenovo ThinkPad X1 Carbon Gen 12',
		slug: 'lenovo-thinkpad-x1-carbon-gen-12',
		category: 'laptop',
		brand: 'Lenovo',
		price: 32_500_000,
		rating: 4.9,
		sold: 98,
		stock: 6,
		specs: ['Core Ultra 7 155U', '32GB LPDDR5x', '1TB SSD', '14" 2.8K OLED']
	},
	{
		id: 'p_3',
		name: 'Acer Aspire 5 Slim',
		slug: 'acer-aspire-5-slim',
		category: 'laptop',
		brand: 'Acer',
		price: 8_299_000,
		originalPrice: 9_199_000,
		rating: 4.5,
		sold: 1_204,
		stock: 40,
		specs: ['Ryzen 5 7530U', '16GB RAM', '512GB SSD', '15.6" FHD IPS']
	},
	{
		id: 'p_4',
		name: 'PC Gaming Ryzen 7 RTX 4070 Super',
		slug: 'pc-gaming-ryzen-7-rtx-4070-super',
		category: 'pc-rakitan',
		brand: 'TokoKomputer',
		price: 21_750_000,
		rating: 4.9,
		sold: 87,
		stock: 5,
		specs: ['Ryzen 7 7800X3D', 'RTX 4070 Super 12GB', '32GB DDR5', '1TB NVMe Gen4']
	},
	{
		id: 'p_5',
		name: 'PC Kantor Intel Core i5',
		slug: 'pc-kantor-intel-core-i5',
		category: 'pc-rakitan',
		brand: 'TokoKomputer',
		price: 7_450_000,
		rating: 4.6,
		sold: 256,
		stock: 22,
		specs: ['Core i5-14400', '16GB DDR4', '512GB NVMe', 'Windows 11 Pro']
	},
	{
		id: 'p_6',
		name: 'AMD Ryzen 7 7800X3D',
		slug: 'amd-ryzen-7-7800x3d',
		category: 'komponen',
		brand: 'AMD',
		price: 6_250_000,
		originalPrice: 6_899_000,
		rating: 4.9,
		sold: 640,
		stock: 18,
		specs: ['8 Core / 16 Thread', 'Boost 5.0GHz', '96MB L3 Cache', 'Socket AM5']
	},
	{
		id: 'p_7',
		name: 'MSI GeForce RTX 4070 Super Ventus 2X',
		slug: 'msi-rtx-4070-super-ventus-2x',
		category: 'komponen',
		brand: 'MSI',
		price: 10_499_000,
		rating: 4.7,
		sold: 221,
		stock: 9,
		specs: ['12GB GDDR6X', 'DLSS 3', 'Dual Fan', 'PCIe 4.0']
	},
	{
		id: 'p_8',
		name: 'Samsung 990 Pro 2TB NVMe',
		slug: 'samsung-990-pro-2tb',
		category: 'komponen',
		brand: 'Samsung',
		price: 2_899_000,
		rating: 4.9,
		sold: 980,
		stock: 35,
		specs: ['PCIe 4.0 x4', 'Read 7450MB/s', 'Write 6900MB/s', 'Garansi 5 Tahun']
	},
	{
		id: 'p_9',
		name: 'LG UltraGear 27" QHD 180Hz',
		slug: 'lg-ultragear-27-qhd-180hz',
		category: 'monitor',
		brand: 'LG',
		price: 4_199_000,
		originalPrice: 4_799_000,
		rating: 4.8,
		sold: 410,
		stock: 12,
		specs: ['27" Nano IPS', '2560x1440', '180Hz 1ms', 'HDR10']
	},
	{
		id: 'p_10',
		name: 'Dell UltraSharp U2724D',
		slug: 'dell-ultrasharp-u2724d',
		category: 'monitor',
		brand: 'Dell',
		price: 6_899_000,
		rating: 4.7,
		sold: 76,
		stock: 0,
		specs: ['27" IPS Black', 'QHD 120Hz', '100% sRGB', 'USB-C Hub']
	},
	{
		id: 'p_11',
		name: 'Logitech MX Master 3S',
		slug: 'logitech-mx-master-3s',
		category: 'aksesoris',
		brand: 'Logitech',
		price: 1_549_000,
		rating: 4.9,
		sold: 1_870,
		stock: 60,
		specs: ['8000 DPI', 'Quiet Click', 'USB-C', 'Multi-device']
	},
	{
		id: 'p_12',
		name: 'Keychron K8 Pro Wireless',
		slug: 'keychron-k8-pro-wireless',
		category: 'aksesoris',
		brand: 'Keychron',
		price: 1_699_000,
		originalPrice: 1_899_000,
		rating: 4.7,
		sold: 532,
		stock: 25,
		specs: ['TKL Hot-swap', 'Gateron Brown', 'Bluetooth 5.1', 'QMK/VIA']
	},
	{
		id: 'p_13',
		name: 'TP-Link Archer AX55 WiFi 6',
		slug: 'tp-link-archer-ax55',
		category: 'jaringan',
		brand: 'TP-Link',
		price: 1_199_000,
		rating: 4.6,
		sold: 745,
		stock: 30,
		specs: ['AX3000 Dual Band', 'OFDMA', '4 Antena', 'Gigabit Port']
	}
];

await db.transaction(async (tx) => {
	await tx.delete(sessions);
	await tx.delete(products);
	await tx.delete(categories);
	await tx.delete(users);

	await tx.insert(users).values(userRows);
	await tx.insert(categories).values(categoryRows);
	await tx.insert(products).values(productRows);
});

console.log(
	`Seed selesai: ${userRows.length} user, ${categoryRows.length} kategori, ${productRows.length} produk.`
);
