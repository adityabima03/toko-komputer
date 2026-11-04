import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../src/lib/server/db/schema.ts';
import { hashPassword } from '../src/lib/server/password.ts';

const { users, sessions, categories, products } = schema;

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL belum diset di .env');

const pool = mysql.createPool(process.env.DATABASE_URL);
const db = drizzle(pool, { schema, mode: 'default' });

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
	{ slug: 'laptop', name: 'Laptop', groupName: 'Komputer', sortOrder: 10 },
	{ slug: 'pc-rakitan', name: 'PC Rakitan', groupName: 'Komputer', sortOrder: 20 },
	{ slug: 'monitor', name: 'Monitor', groupName: 'Komputer', sortOrder: 30 },
	{ slug: 'cpu', name: 'CPU', groupName: 'Komponen', sortOrder: 40 },
	{ slug: 'gpu', name: 'GPU', groupName: 'Komponen', sortOrder: 50 },
	{ slug: 'ram', name: 'RAM', groupName: 'Komponen', sortOrder: 60 },
	{ slug: 'motherboard', name: 'Motherboard', groupName: 'Komponen', sortOrder: 70 },
	{ slug: 'penyimpanan', name: 'Penyimpanan', groupName: 'Komponen', sortOrder: 80 },
	{ slug: 'power-supply', name: 'Power Supply', groupName: 'Komponen', sortOrder: 90 },
	{ slug: 'pendingin', name: 'Pendingin', groupName: 'Komponen', sortOrder: 100 },
	{ slug: 'mouse', name: 'Mouse', groupName: 'Peripheral', sortOrder: 110 },
	{ slug: 'keyboard', name: 'Keyboard', groupName: 'Peripheral', sortOrder: 120 },
	{ slug: 'headset', name: 'Headset', groupName: 'Peripheral', sortOrder: 130 },
	{ slug: 'earphone', name: 'Earphone', groupName: 'Peripheral', sortOrder: 140 },
	{ slug: 'webcam', name: 'Webcam', groupName: 'Peripheral', sortOrder: 150 },
	{ slug: 'jaringan', name: 'Jaringan', groupName: 'Jaringan', sortOrder: 160 }
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
		specs: ['Intel Core i7-14650HX', 'RTX 4060 8GB', '16GB DDR5', '1TB NVMe'],
		image: '/api/products/p_1/image'
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
		specs: ['Core Ultra 7 155U', '32GB LPDDR5x', '1TB SSD', '14" 2.8K OLED'],
		image: '/api/products/p_2/image'
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
		specs: ['Ryzen 5 7530U', '16GB RAM', '512GB SSD', '15.6" FHD IPS'],
		image: '/api/products/p_3/image'
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
		specs: ['Ryzen 7 7800X3D', 'RTX 4070 Super 12GB', '32GB DDR5', '1TB NVMe Gen4'],
		image: '/api/products/p_4/image'
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
		specs: ['Core i5-14400', '16GB DDR4', '512GB NVMe', 'Windows 11 Pro'],
		image: '/api/products/p_5/image'
	},
	{
		id: 'p_6',
		name: 'AMD Ryzen 7 7800X3D',
		slug: 'amd-ryzen-7-7800x3d',
		category: 'cpu',
		brand: 'AMD',
		price: 6_250_000,
		originalPrice: 6_899_000,
		rating: 4.9,
		sold: 640,
		stock: 18,
		specs: ['8 Core / 16 Thread', 'Boost 5.0GHz', '96MB L3 Cache', 'Socket AM5'],
		image: '/api/products/p_6/image'
	},
	{
		id: 'p_7',
		name: 'MSI GeForce RTX 4070 Super Ventus 2X',
		slug: 'msi-rtx-4070-super-ventus-2x',
		category: 'gpu',
		brand: 'MSI',
		price: 10_499_000,
		rating: 4.7,
		sold: 221,
		stock: 9,
		specs: ['12GB GDDR6X', 'DLSS 3', 'Dual Fan', 'PCIe 4.0'],
		image: '/api/products/p_7/image'
	},
	{
		id: 'p_8',
		name: 'Samsung 990 Pro 2TB NVMe',
		slug: 'samsung-990-pro-2tb',
		category: 'penyimpanan',
		brand: 'Samsung',
		price: 2_899_000,
		rating: 4.9,
		sold: 980,
		stock: 35,
		specs: ['PCIe 4.0 x4', 'Read 7450MB/s', 'Write 6900MB/s', 'Garansi 5 Tahun'],
		image: '/api/products/p_8/image'
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
		specs: ['27" Nano IPS', '2560x1440', '180Hz 1ms', 'HDR10'],
		image: '/api/products/p_9/image'
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
		specs: ['27" IPS Black', 'QHD 120Hz', '100% sRGB', 'USB-C Hub'],
		image: '/api/products/p_10/image'
	},
	{
		id: 'p_11',
		name: 'Logitech MX Master 3S',
		slug: 'logitech-mx-master-3s',
		category: 'mouse',
		brand: 'Logitech',
		price: 1_549_000,
		rating: 4.9,
		sold: 1_870,
		stock: 60,
		specs: ['8000 DPI', 'Quiet Click', 'USB-C', 'Multi-device'],
		image: '/api/products/p_11/image'
	},
	{
		id: 'p_12',
		name: 'Keychron K8 Pro Wireless',
		slug: 'keychron-k8-pro-wireless',
		category: 'keyboard',
		brand: 'Keychron',
		price: 1_699_000,
		originalPrice: 1_899_000,
		rating: 4.7,
		sold: 532,
		stock: 25,
		specs: ['TKL Hot-swap', 'Gateron Brown', 'Bluetooth 5.1', 'QMK/VIA'],
		image: '/api/products/p_12/image'
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
		specs: ['AX3000 Dual Band', 'OFDMA', '4 Antena', 'Gigabit Port'],
		image: '/api/products/p_13/image'
	},
	{
		id: 'p_14',
		name: 'Apple MacBook Air 13" M3',
		slug: 'apple-macbook-air-13-m3',
		category: 'laptop',
		brand: 'Apple',
		price: 18_499_000,
		originalPrice: 19_999_000,
		rating: 4.9,
		sold: 428,
		stock: 11,
		specs: ['Apple M3 8-core', '16GB Unified Memory', '512GB SSD', '13.6" Liquid Retina'],
		image: '/api/products/p_14/image'
	},
	{
		id: 'p_15',
		name: 'HP Victus 16 RTX 4050',
		slug: 'hp-victus-16-rtx-4050',
		category: 'laptop',
		brand: 'HP',
		price: 13_999_000,
		rating: 4.6,
		sold: 367,
		stock: 16,
		specs: ['Intel Core i5-13500H', 'RTX 4050 6GB', '16GB DDR5', '512GB NVMe'],
		image: '/api/products/p_15/image'
	},
	{
		id: 'p_16',
		name: 'ASUS Zenbook 14 OLED',
		slug: 'asus-zenbook-14-oled',
		category: 'laptop',
		brand: 'ASUS',
		price: 17_250_000,
		originalPrice: 18_499_000,
		rating: 4.8,
		sold: 154,
		stock: 8,
		specs: ['Core Ultra 7 155H', '16GB LPDDR5x', '1TB SSD', '14" 3K OLED'],
		image: '/api/products/p_16/image'
	},
	{
		id: 'p_17',
		name: 'MSI Katana 15 B13V',
		slug: 'msi-katana-15-b13v',
		category: 'laptop',
		brand: 'MSI',
		price: 15_750_000,
		rating: 4.5,
		sold: 289,
		stock: 10,
		specs: ['Core i7-13620H', 'RTX 4060 8GB', '16GB DDR5', '512GB NVMe'],
		image: '/api/products/p_17/image'
	},
	{
		id: 'p_18',
		name: 'Lenovo IdeaPad Slim 3',
		slug: 'lenovo-ideapad-slim-3',
		category: 'laptop',
		brand: 'Lenovo',
		price: 6_499_000,
		originalPrice: 7_299_000,
		rating: 4.4,
		sold: 1_542,
		stock: 48,
		specs: ['Ryzen 5 7520U', '8GB LPDDR5', '512GB SSD', '15.6" FHD'],
		image: '/api/products/p_18/image'
	},
	{
		id: 'p_19',
		name: 'PC Creator Ryzen 9 RTX 4080 Super',
		slug: 'pc-creator-ryzen-9-rtx-4080-super',
		category: 'pc-rakitan',
		brand: 'TokoKomputer',
		price: 42_500_000,
		rating: 4.9,
		sold: 34,
		stock: 3,
		specs: ['Ryzen 9 7950X', 'RTX 4080 Super 16GB', '64GB DDR5', '2TB NVMe Gen4'],
		image: '/api/products/p_19/image'
	},
	{
		id: 'p_20',
		name: 'PC Gaming Ryzen 5 RTX 4060',
		slug: 'pc-gaming-ryzen-5-rtx-4060',
		category: 'pc-rakitan',
		brand: 'TokoKomputer',
		price: 14_250_000,
		originalPrice: 15_499_000,
		rating: 4.7,
		sold: 198,
		stock: 9,
		specs: ['Ryzen 5 7600', 'RTX 4060 8GB', '16GB DDR5', '1TB NVMe'],
		image: '/api/products/p_20/image'
	},
	{
		id: 'p_21',
		name: 'Mini PC Beelink SER5',
		slug: 'mini-pc-beelink-ser5',
		category: 'pc-rakitan',
		brand: 'Beelink',
		price: 4_199_000,
		rating: 4.6,
		sold: 276,
		stock: 20,
		specs: ['Ryzen 5 5560U', '16GB DDR4', '500GB NVMe', 'WiFi 6'],
		image: '/api/products/p_21/image'
	},
	{
		id: 'p_22',
		name: 'Intel Core i5-14600KF',
		slug: 'intel-core-i5-14600kf',
		category: 'cpu',
		brand: 'Intel',
		price: 4_350_000,
		rating: 4.8,
		sold: 512,
		stock: 24,
		specs: ['14 Core / 20 Thread', 'Boost 5.3GHz', '125W TDP', 'Socket LGA1700'],
		image: '/api/products/p_22/image'
	},
	{
		id: 'p_23',
		name: 'Kingston Fury Beast 32GB DDR5-6000',
		slug: 'kingston-fury-beast-32gb-ddr5',
		category: 'ram',
		brand: 'Kingston',
		price: 1_649_000,
		originalPrice: 1_899_000,
		rating: 4.8,
		sold: 890,
		stock: 42,
		specs: ['32GB (2x16GB)', 'DDR5-6000', 'CL30', 'Intel XMP 3.0'],
		image: '/api/products/p_23/image'
	},
	{
		id: 'p_24',
		name: 'ASUS TUF Gaming B650-PLUS',
		slug: 'asus-tuf-gaming-b650-plus',
		category: 'motherboard',
		brand: 'ASUS',
		price: 2_899_000,
		rating: 4.7,
		sold: 341,
		stock: 15,
		specs: ['Socket AM5', 'DDR5 hingga 192GB', 'PCIe 5.0', '2.5G LAN'],
		image: '/api/products/p_24/image'
	},
	{
		id: 'p_25',
		name: 'Corsair RM750e 750W Gold',
		slug: 'corsair-rm750e-750w',
		category: 'power-supply',
		brand: 'Corsair',
		price: 1_799_000,
		rating: 4.8,
		sold: 623,
		stock: 28,
		specs: ['750W', '80+ Gold', 'Full Modular', 'ATX 3.0'],
		image: '/api/products/p_25/image'
	},
	{
		id: 'p_26',
		name: 'WD Black SN850X 1TB',
		slug: 'wd-black-sn850x-1tb',
		category: 'penyimpanan',
		brand: 'Western Digital',
		price: 1_899_000,
		originalPrice: 2_199_000,
		rating: 4.9,
		sold: 754,
		stock: 31,
		specs: ['PCIe 4.0 x4', 'Read 7300MB/s', '1TB', 'Heatsink opsional'],
		image: '/api/products/p_26/image'
	},
	{
		id: 'p_27',
		name: 'Deepcool AK400 Digital',
		slug: 'deepcool-ak400-digital',
		category: 'pendingin',
		brand: 'Deepcool',
		price: 549_000,
		rating: 4.6,
		sold: 1_120,
		stock: 55,
		specs: ['120mm Fan', '4 Heatpipe', 'Display suhu', 'TDP 220W'],
		image: '/api/products/p_27/image'
	},
	{
		id: 'p_28',
		name: 'Gigabyte RTX 4060 Eagle OC 8GB',
		slug: 'gigabyte-rtx-4060-eagle-oc',
		category: 'gpu',
		brand: 'Gigabyte',
		price: 5_299_000,
		originalPrice: 5_799_000,
		rating: 4.7,
		sold: 418,
		stock: 13,
		specs: ['8GB GDDR6', 'DLSS 3', 'Triple Fan', 'PCIe 4.0'],
		image: '/api/products/p_28/image'
	},
	{
		id: 'p_29',
		name: 'TeamGroup T-Force Delta 16GB DDR4',
		slug: 'teamgroup-tforce-delta-16gb-ddr4',
		category: 'ram',
		brand: 'TeamGroup',
		price: 649_000,
		rating: 4.5,
		sold: 1_305,
		stock: 70,
		specs: ['16GB (2x8GB)', 'DDR4-3200', 'CL16', 'RGB'],
		image: '/api/products/p_29/image'
	},
	{
		id: 'p_30',
		name: 'Samsung Odyssey G5 32" 165Hz',
		slug: 'samsung-odyssey-g5-32-165hz',
		category: 'monitor',
		brand: 'Samsung',
		price: 4_499_000,
		rating: 4.6,
		sold: 233,
		stock: 14,
		specs: ['32" VA', '2560x1440', '165Hz 1ms', 'AMD FreeSync'],
		image: '/api/products/p_30/image'
	},
	{
		id: 'p_31',
		name: 'ASUS ProArt PA278CGV',
		slug: 'asus-proart-pa278cgv',
		category: 'monitor',
		brand: 'ASUS',
		price: 7_250_000,
		rating: 4.8,
		sold: 61,
		stock: 7,
		specs: ['27" IPS', 'QHD 144Hz', '95% DCI-P3', 'USB-C 90W'],
		image: '/api/products/p_31/image'
	},
	{
		id: 'p_32',
		name: 'AOC 24G2SP 24" 165Hz',
		slug: 'aoc-24g2sp-24-165hz',
		category: 'monitor',
		brand: 'AOC',
		price: 2_149_000,
		originalPrice: 2_499_000,
		rating: 4.7,
		sold: 876,
		stock: 26,
		specs: ['24" IPS', '1920x1080', '165Hz 1ms', 'G-Sync Compatible'],
		image: '/api/products/p_32/image'
	},
	{
		id: 'p_33',
		name: 'BenQ GW2480 24" IPS',
		slug: 'benq-gw2480-24-ips',
		category: 'monitor',
		brand: 'BenQ',
		price: 1_599_000,
		rating: 4.5,
		sold: 640,
		stock: 33,
		specs: ['24" IPS', 'Full HD', '75Hz', 'Eye-care Low Blue Light'],
		image: '/api/products/p_33/image'
	},
	{
		id: 'p_34',
		name: 'Razer DeathAdder V3',
		slug: 'razer-deathadder-v3',
		category: 'mouse',
		brand: 'Razer',
		price: 1_099_000,
		rating: 4.8,
		sold: 1_244,
		stock: 40,
		specs: ['30.000 DPI', '59g', 'Optical Switch', 'Kabel Speedflex'],
		image: '/api/products/p_34/image'
	},
	{
		id: 'p_35',
		name: 'Sony WH-1000XM5',
		slug: 'sony-wh-1000xm5',
		category: 'headset',
		brand: 'Sony',
		price: 4_999_000,
		originalPrice: 5_499_000,
		rating: 4.9,
		sold: 692,
		stock: 18,
		specs: ['ANC', '30 jam baterai', 'Multipoint', 'USB-C'],
		image: '/api/products/p_35/image'
	},
	{
		id: 'p_36',
		name: 'Logitech G Pro X TKL',
		slug: 'logitech-g-pro-x-tkl',
		category: 'keyboard',
		brand: 'Logitech',
		price: 1_899_000,
		rating: 4.7,
		sold: 388,
		stock: 22,
		specs: ['TKL', 'GX Blue Clicky', 'LIGHTSYNC RGB', 'Detachable Cable'],
		image: '/api/products/p_36/image'
	},
	{
		id: 'p_37',
		name: 'SanDisk Extreme Portable SSD 1TB',
		slug: 'sandisk-extreme-portable-1tb',
		category: 'penyimpanan',
		brand: 'SanDisk',
		price: 1_749_000,
		rating: 4.8,
		sold: 510,
		stock: 36,
		specs: ['1TB', '1050MB/s', 'IP65', 'USB-C'],
		image: '/api/products/p_37/image'
	},
	{
		id: 'p_38',
		name: 'Logitech Brio 4K Webcam',
		slug: 'logitech-brio-4k',
		category: 'webcam',
		brand: 'Logitech',
		price: 2_299_000,
		originalPrice: 2_599_000,
		rating: 4.6,
		sold: 274,
		stock: 19,
		specs: ['4K 30fps', 'HDR', 'RightLight 3', 'Windows Hello'],
		image: '/api/products/p_38/image'
	},
	{
		id: 'p_39',
		name: 'SteelSeries Arctis Nova 7',
		slug: 'steelseries-arctis-nova-7',
		category: 'headset',
		brand: 'SteelSeries',
		price: 2_450_000,
		rating: 4.7,
		sold: 356,
		stock: 17,
		specs: ['Wireless 2.4GHz', '38 jam baterai', 'Retractable Mic', 'Multi-platform'],
		image: '/api/products/p_39/image'
	},
	{
		id: 'p_40',
		name: 'ASUS RT-AX86U Pro WiFi 6',
		slug: 'asus-rt-ax86u-pro',
		category: 'jaringan',
		brand: 'ASUS',
		price: 3_499_000,
		rating: 4.8,
		sold: 142,
		stock: 12,
		specs: ['AX5700', '2.5G WAN', 'AiMesh', 'Gaming Port'],
		image: '/api/products/p_40/image'
	},
	{
		id: 'p_41',
		name: 'TP-Link TL-SG108 8-Port',
		slug: 'tp-link-tl-sg108',
		category: 'jaringan',
		brand: 'TP-Link',
		price: 429_000,
		rating: 4.7,
		sold: 1_680,
		stock: 80,
		specs: ['8 Port Gigabit', 'Metal Housing', 'Plug and Play', 'Fanless'],
		image: '/api/products/p_41/image'
	},
	{
		id: 'p_42',
		name: 'Mercusys Halo H50G Mesh 2-Pack',
		slug: 'mercusys-halo-h50g',
		category: 'jaringan',
		brand: 'Mercusys',
		price: 1_349_000,
		originalPrice: 1_599_000,
		rating: 4.5,
		sold: 493,
		stock: 27,
		specs: ['AC1900', 'Mesh 2 unit', 'Coverage 350m²', 'Gigabit Port'],
		image: '/api/products/p_42/image'
	},
	{
		id: 'p_43',
		name: 'Ubiquiti UniFi U6 Lite',
		slug: 'ubiquiti-unifi-u6-lite',
		category: 'jaringan',
		brand: 'Ubiquiti',
		price: 1_899_000,
		rating: 4.8,
		sold: 218,
		stock: 15,
		specs: ['WiFi 6', 'Dual Band', 'PoE', 'Controller UniFi'],
		image: '/api/products/p_43/image'
	},
	{
		id: 'p_44',
		name: 'Sony WF-1000XM5',
		slug: 'sony-wf-1000xm5',
		category: 'earphone',
		brand: 'Sony',
		price: 3_499_000,
		originalPrice: 3_999_000,
		rating: 4.8,
		sold: 540,
		stock: 21,
		specs: ['TWS ANC', 'IPX4', '8 jam baterai', 'Multipoint'],
		image: '/api/products/p_44/image'
	},
	{
		id: 'p_45',
		name: 'Apple AirPods Pro 2',
		slug: 'apple-airpods-pro-2',
		category: 'earphone',
		brand: 'Apple',
		price: 3_799_000,
		rating: 4.9,
		sold: 860,
		stock: 18,
		specs: ['ANC', 'USB-C', 'Adaptive Audio', 'MagSafe Case'],
		image: '/api/products/p_45/image'
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

await pool.end();

console.log(
	`Seed selesai: ${userRows.length} user, ${categoryRows.length} kategori, ${productRows.length} produk.`
);
