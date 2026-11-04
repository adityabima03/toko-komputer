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
		name: 'Apple MacBook Pro 16" M3 Pro',
		slug: 'apple-macbook-pro-16-m3-pro',
		category: 'laptop',
		brand: 'Apple',
		price: 24_999_000,
		originalPrice: 27_499_000,
		rating: 4.8,
		sold: 312,
		stock: 14,
		specs: ['Layar 16.2" Liquid Retina XDR', 'Chip Apple M3 Pro', 'RAM 18GB', 'SSD 512GB'],
		image: '/api/products/p_1/image'
	},
	{
		id: 'p_2',
		name: 'Sony WH-1000XM5 Headphone Wireless',
		slug: 'sony-wh-1000xm5-headphone-wireless',
		category: 'headset',
		brand: 'Sony',
		price: 32_500_000,
		rating: 4.9,
		sold: 98,
		stock: 6,
		specs: ['ANC', 'Bluetooth 5.2', 'Baterai 30 jam', 'Multipoint'],
		image: '/api/products/p_2/image'
	},
	{
		id: 'p_3',
		name: 'Apple MacBook Pro 13" Silver',
		slug: 'apple-macbook-pro-13-silver',
		category: 'laptop',
		brand: 'Apple',
		price: 8_299_000,
		originalPrice: 9_199_000,
		rating: 4.5,
		sold: 1_204,
		stock: 40,
		specs: ['Layar 13.3" Retina', 'Chip Apple M2', 'RAM 8GB', 'SSD 256GB'],
		image: '/api/products/p_3/image'
	},
	{
		id: 'p_4',
		name: 'PC Gaming RGB RTX High-End Custom',
		slug: 'pc-gaming-rgb-rtx-high-end-custom',
		category: 'pc-rakitan',
		brand: 'TokoKomputer',
		price: 21_750_000,
		rating: 4.9,
		sold: 87,
		stock: 5,
		specs: ['Cooler Thermaltake AIO', 'GPU MSI RGB', 'Motherboard ASUS ROG', 'RAM G.Skill Trident Z'],
		image: '/api/products/p_4/image'
	},
	{
		id: 'p_5',
		name: 'Alienware Aurora R15 Lunar Light',
		slug: 'alienware-aurora-r15-lunar-light',
		category: 'pc-rakitan',
		brand: 'Alienware',
		price: 7_450_000,
		rating: 4.6,
		sold: 256,
		stock: 22,
		specs: ['Case Alienware Aurora', 'Monitor Alienware', 'Keyboard AW510K', 'Mouse & headset matching'],
		image: '/api/products/p_5/image'
	},
	{
		id: 'p_6',
		name: 'ASUS TUF Gaming B760M-PLUS WiFi',
		slug: 'asus-tuf-gaming-b760m-plus-wifi',
		category: 'motherboard',
		brand: 'ASUS',
		price: 6_250_000,
		originalPrice: 6_899_000,
		rating: 4.9,
		sold: 640,
		stock: 18,
		specs: ['Chipset Intel B760', 'Socket LGA1700', 'DDR5', 'WiFi 6'],
		image: '/api/products/p_6/image'
	},
	{
		id: 'p_7',
		name: 'NVIDIA GeForce RTX 2080 Founders Edition',
		slug: 'nvidia-geforce-rtx-2080-founders-edition',
		category: 'gpu',
		brand: 'NVIDIA',
		price: 10_499_000,
		rating: 4.7,
		sold: 221,
		stock: 9,
		specs: ['8GB GDDR6', 'Dual fan Founders', 'Ray Tracing', 'DisplayPort + HDMI'],
		image: '/api/products/p_7/image'
	},
	{
		id: 'p_8',
		name: 'Corsair iCUE H100i RGB Liquid Cooler',
		slug: 'corsair-icue-h100i-rgb-liquid-cooler',
		category: 'pendingin',
		brand: 'Corsair',
		price: 2_899_000,
		rating: 4.9,
		sold: 980,
		stock: 35,
		specs: ['Radiator 240mm', 'Pompa RGB iCUE', 'Fan PWM', 'Intel & AMD'],
		image: '/api/products/p_8/image'
	},
	{
		id: 'p_9',
		name: 'Apple iMac 21.5" dengan Magic Keyboard',
		slug: 'apple-imac-21-5-dengan-magic-keyboard',
		category: 'pc-rakitan',
		brand: 'Apple',
		price: 4_199_000,
		originalPrice: 4_799_000,
		rating: 4.8,
		sold: 410,
		stock: 12,
		specs: ['All-in-one desktop', 'Layar Retina', 'Magic Keyboard', 'Magic Trackpad'],
		image: '/api/products/p_9/image'
	},
	{
		id: 'p_10',
		name: 'Dell UltraSharp Monitor Dual Setup 27"',
		slug: 'dell-ultrasharp-monitor-dual-setup-27',
		category: 'monitor',
		brand: 'Dell',
		price: 6_899_000,
		rating: 4.7,
		sold: 76,
		stock: 0,
		specs: ['Panel IPS 27"', 'Resolusi QHD/4K', 'USB-C hub', 'Pivot & height adjust'],
		image: '/api/products/p_10/image'
	},
	{
		id: 'p_11',
		name: 'Logitech Mouse Wireless Compact Silver',
		slug: 'logitech-mouse-wireless-compact-silver',
		category: 'mouse',
		brand: 'Logitech',
		price: 1_549_000,
		rating: 4.9,
		sold: 1_870,
		stock: 60,
		specs: ['Wireless 2.4GHz', 'Desain ringkas', 'Scroll rubber', 'Baterai tahan lama'],
		image: '/api/products/p_11/image'
	},
	{
		id: 'p_12',
		name: 'Apple Magic Keyboard & Magic Mouse',
		slug: 'apple-magic-keyboard-magic-mouse',
		category: 'keyboard',
		brand: 'Apple',
		price: 1_699_000,
		originalPrice: 1_899_000,
		rating: 4.7,
		sold: 532,
		stock: 25,
		specs: ['Bluetooth', 'Layout compact', 'Magic Mouse 2', 'Rechargeable'],
		image: '/api/products/p_12/image'
	},
	{
		id: 'p_13',
		name: 'D-Link DSL Modem Router Dual Antenna',
		slug: 'd-link-dsl-modem-router-dual-antenna',
		category: 'jaringan',
		brand: 'D-Link',
		price: 1_199_000,
		rating: 4.6,
		sold: 745,
		stock: 30,
		specs: ['Port DSL', '2 port LAN', '2 antena eksternal', 'WiFi dual band'],
		image: '/api/products/p_13/image'
	},
	{
		id: 'p_14',
		name: 'Apple MacBook Air M2 Midnight',
		slug: 'apple-macbook-air-m2-midnight',
		category: 'laptop',
		brand: 'Apple',
		price: 18_499_000,
		originalPrice: 19_999_000,
		rating: 4.9,
		sold: 428,
		stock: 11,
		specs: ['Layar 13.6" Liquid Retina', 'Chip Apple M2', 'RAM 8GB', 'SSD 512GB'],
		image: '/api/products/p_14/image'
	},
	{
		id: 'p_15',
		name: 'Dell XPS 13 InfinityEdge Ultrabook',
		slug: 'dell-xps-13-infinityedge-ultrabook',
		category: 'laptop',
		brand: 'Dell',
		price: 13_999_000,
		rating: 4.6,
		sold: 367,
		stock: 16,
		specs: ['Layar 13.4" FHD+', 'Intel Core i7', 'RAM 16GB', 'SSD 512GB'],
		image: '/api/products/p_15/image'
	},
	{
		id: 'p_16',
		name: 'Apple MacBook Pro 14" Backlit Keyboard',
		slug: 'apple-macbook-pro-14-backlit-keyboard',
		category: 'laptop',
		brand: 'Apple',
		price: 17_250_000,
		originalPrice: 18_499_000,
		rating: 4.8,
		sold: 154,
		stock: 8,
		specs: ['Layar 14.2" Liquid Retina XDR', 'Chip Apple M3', 'Magic Keyboard backlight', 'Trackpad Force Touch'],
		image: '/api/products/p_16/image'
	},
	{
		id: 'p_17',
		name: 'Apple MacBook Air 13" Space Gray',
		slug: 'apple-macbook-air-13-space-gray',
		category: 'laptop',
		brand: 'Apple',
		price: 15_750_000,
		rating: 4.5,
		sold: 289,
		stock: 10,
		specs: ['Layar Retina 13.3"', 'Chip Apple M1', 'RAM 8GB', 'SSD 256GB'],
		image: '/api/products/p_17/image'
	},
	{
		id: 'p_18',
		name: 'Apple MacBook Pro 13" Cafe Edition Silver',
		slug: 'apple-macbook-pro-13-cafe-edition-silver',
		category: 'laptop',
		brand: 'Apple',
		price: 6_499_000,
		originalPrice: 7_299_000,
		rating: 4.4,
		sold: 1_542,
		stock: 48,
		specs: ['Layar 13.3" Retina', 'Chassis aluminium', 'Port Thunderbolt', 'Ringan portable'],
		image: '/api/products/p_18/image'
	},
	{
		id: 'p_19',
		name: 'PC Creator RGB Thermaltake + Trident Z',
		slug: 'pc-creator-rgb-thermaltake-trident-z',
		category: 'pc-rakitan',
		brand: 'TokoKomputer',
		price: 42_500_000,
		rating: 4.9,
		sold: 34,
		stock: 3,
		specs: ['AIO Thermaltake', 'RAM G.Skill Trident Z RGB', 'Motherboard ASUS ROG', 'GPU MSI'],
		image: '/api/products/p_19/image'
	},
	{
		id: 'p_20',
		name: 'Alienware AW3423DW Monitor Curved 34"',
		slug: 'alienware-aw3423dw-monitor-curved-34',
		category: 'monitor',
		brand: 'Alienware',
		price: 14_250_000,
		originalPrice: 15_499_000,
		rating: 4.7,
		sold: 198,
		stock: 9,
		specs: ['34" QD-OLED curved', '165Hz', '3440x1440', 'HDR True Black'],
		image: '/api/products/p_20/image'
	},
	{
		id: 'p_21',
		name: 'PC Gaming ASUS Z170 + Corsair AIO',
		slug: 'pc-gaming-asus-z170-corsair-aio',
		category: 'pc-rakitan',
		brand: 'TokoKomputer',
		price: 4_199_000,
		rating: 4.6,
		sold: 276,
		stock: 20,
		specs: ['Motherboard ASUS Z170 Pro Gaming', 'Cooler Corsair AIO', 'RAM HyperX Fury', 'GPU ASUS ROG'],
		image: '/api/products/p_21/image'
	},
	{
		id: 'p_22',
		name: 'Intel Core i9-9900K Processor',
		slug: 'intel-core-i9-9900k-processor',
		category: 'cpu',
		brand: 'Intel',
		price: 4_350_000,
		rating: 4.8,
		sold: 512,
		stock: 24,
		specs: ['8 core 16 thread', 'Base 3.6GHz', 'Socket LGA1151', 'TDP 95W'],
		image: '/api/products/p_22/image'
	},
	{
		id: 'p_23',
		name: 'AMD Ryzen 7 3700X Processor',
		slug: 'amd-ryzen-7-3700x-processor',
		category: 'cpu',
		brand: 'AMD',
		price: 1_649_000,
		originalPrice: 1_899_000,
		rating: 4.8,
		sold: 890,
		stock: 42,
		specs: ['8 core 16 thread', 'Base 3.6GHz boost 4.4GHz', 'Socket AM4', 'TDP 65W'],
		image: '/api/products/p_23/image'
	},
	{
		id: 'p_24',
		name: 'Samsung DDR SO-DIMM Laptop RAM 8GB',
		slug: 'samsung-ddr-so-dimm-laptop-ram-8gb',
		category: 'ram',
		brand: 'Samsung',
		price: 2_899_000,
		rating: 4.7,
		sold: 341,
		stock: 15,
		specs: ['Form factor SO-DIMM', 'Chip Samsung original', 'Untuk laptop', 'Gold contact'],
		image: '/api/products/p_24/image'
	},
	{
		id: 'p_25',
		name: 'Corsair HX620W Modular Power Supply',
		slug: 'corsair-hx620w-modular-power-supply',
		category: 'power-supply',
		brand: 'Corsair',
		price: 1_799_000,
		rating: 4.8,
		sold: 623,
		stock: 28,
		specs: ['620W', 'Modular', '80 Plus', 'Kipas 120mm'],
		image: '/api/products/p_25/image'
	},
	{
		id: 'p_26',
		name: 'ASUS ROG Maximus Z790 Hero',
		slug: 'asus-rog-maximus-z790-hero',
		category: 'motherboard',
		brand: 'ASUS',
		price: 1_899_000,
		originalPrice: 2_199_000,
		rating: 4.9,
		sold: 754,
		stock: 31,
		specs: ['Chipset Z790', 'DDR5', 'PCIe 5.0', 'VRM high-end'],
		image: '/api/products/p_26/image'
	},
	{
		id: 'p_27',
		name: 'Deepcool Tower CPU Air Cooler',
		slug: 'deepcool-tower-cpu-air-cooler',
		category: 'pendingin',
		brand: 'Deepcool',
		price: 549_000,
		rating: 4.6,
		sold: 1_120,
		stock: 55,
		specs: ['Tower heatsink', 'Fan 120mm PWM', 'Heatpipe copper', 'Intel & AMD'],
		image: '/api/products/p_27/image'
	},
	{
		id: 'p_28',
		name: 'PC Rakitan Threadripper + RX 6700 XT',
		slug: 'pc-rakitan-threadripper-rx-6700-xt',
		category: 'pc-rakitan',
		brand: 'TokoKomputer',
		price: 5_299_000,
		originalPrice: 5_799_000,
		rating: 4.7,
		sold: 418,
		stock: 13,
		specs: ['Cooler AMD Threadripper', 'GPU XFX RX 6700 XT', 'Case Lian Li', 'Triple fan GPU'],
		image: '/api/products/p_28/image'
	},
	{
		id: 'p_29',
		name: 'Apple MacBook Pro 13" Space Gray',
		slug: 'apple-macbook-pro-13-space-gray',
		category: 'laptop',
		brand: 'Apple',
		price: 649_000,
		rating: 4.5,
		sold: 1_305,
		stock: 70,
		specs: ['Layar Retina 13"', 'Touch Bar', 'RAM 8GB', 'SSD 256GB'],
		image: '/api/products/p_29/image'
	},
	{
		id: 'p_30',
		name: 'Apple iMac 24" All-in-One Pink Setup',
		slug: 'apple-imac-24-all-in-one-pink-setup',
		category: 'pc-rakitan',
		brand: 'Apple',
		price: 4_499_000,
		rating: 4.6,
		sold: 233,
		stock: 14,
		specs: ['Layar 4.5K Retina', 'Chip Apple Silicon', 'Magic Keyboard', 'Magic Mouse'],
		image: '/api/products/p_30/image'
	},
	{
		id: 'p_31',
		name: 'Sony WH-Series Headphone + Logitech Desk Set',
		slug: 'sony-wh-series-headphone-logitech-desk-set',
		category: 'headset',
		brand: 'Sony',
		price: 7_250_000,
		rating: 4.8,
		sold: 61,
		stock: 7,
		specs: ['Over-ear wireless', 'NFC', 'Bantalan memory foam', 'Cocok kerja remote'],
		image: '/api/products/p_31/image'
	},
	{
		id: 'p_32',
		name: 'Elgato Cam Link 4K Capture Card',
		slug: 'elgato-cam-link-4k-capture-card',
		category: 'webcam',
		brand: 'Elgato',
		price: 2_149_000,
		originalPrice: 2_499_000,
		rating: 4.7,
		sold: 876,
		stock: 26,
		specs: ['HDMI to USB', '4K30', 'Cocok mirrorless', 'Streaming plug-and-play'],
		image: '/api/products/p_32/image'
	},
	{
		id: 'p_33',
		name: 'TP-Link Omada EAP670 WiFi 6 AP',
		slug: 'tp-link-omada-eap670-wifi-6-ap',
		category: 'jaringan',
		brand: 'TP-Link',
		price: 1_599_000,
		rating: 4.5,
		sold: 640,
		stock: 33,
		specs: ['WiFi 6 AX3600', 'PoE+', 'Omada controller', 'Kapasitas tinggi'],
		image: '/api/products/p_33/image'
	},
	{
		id: 'p_34',
		name: 'Logitech G Pro X Superlight 2',
		slug: 'logitech-g-pro-x-superlight-2',
		category: 'mouse',
		brand: 'Logitech',
		price: 1_099_000,
		rating: 4.8,
		sold: 1_244,
		stock: 40,
		specs: ['Wireless LIGHTSPEED', 'Ultra light', 'Sensor HERO', 'Tombol samping'],
		image: '/api/products/p_34/image'
	},
	{
		id: 'p_35',
		name: 'Beats Studio Wireless Over-Ear ANC',
		slug: 'beats-studio-wireless-over-ear-anc',
		category: 'headset',
		brand: 'Beats',
		price: 4_999_000,
		originalPrice: 5_499_000,
		rating: 4.9,
		sold: 692,
		stock: 18,
		specs: ['ANC', 'Bluetooth', 'Bantalan over-ear', 'Kontrol di earcup'],
		image: '/api/products/p_35/image'
	},
	{
		id: 'p_36',
		name: 'Apple Magic Keyboard Wireless Silver',
		slug: 'apple-magic-keyboard-wireless-silver',
		category: 'keyboard',
		brand: 'Apple',
		price: 1_899_000,
		rating: 4.7,
		sold: 388,
		stock: 22,
		specs: ['Bluetooth', 'Layout compact', 'Scissor switch', 'Baterai rechargeable'],
		image: '/api/products/p_36/image'
	},
	{
		id: 'p_37',
		name: 'Keychron K6 Pro 65% Mechanical Retro',
		slug: 'keychron-k6-pro-65-mechanical-retro',
		category: 'keyboard',
		brand: 'Keychron',
		price: 1_749_000,
		rating: 4.8,
		sold: 510,
		stock: 36,
		specs: ['Layout 65%', 'Hot-swappable', 'Keycap PBT retro', 'Bluetooth + wired'],
		image: '/api/products/p_37/image'
	},
	{
		id: 'p_38',
		name: 'Audio-Technica ATH-M50x Studio Headphone',
		slug: 'audio-technica-ath-m50x-studio-headphone',
		category: 'headset',
		brand: 'Audio-Technica',
		price: 2_299_000,
		originalPrice: 2_599_000,
		rating: 4.6,
		sold: 274,
		stock: 19,
		specs: ['Driver 45mm', 'Closed-back', 'Kabel detachable', 'Monitoring studio'],
		image: '/api/products/p_38/image'
	},
	{
		id: 'p_39',
		name: 'Akko 5075B Plus 65% Mechanical Keyboard',
		slug: 'akko-5075b-plus-65-mechanical-keyboard',
		category: 'keyboard',
		brand: 'Akko',
		price: 2_450_000,
		rating: 4.7,
		sold: 356,
		stock: 17,
		specs: ['Switch linear hot-swap', 'Keycap PBT', 'Layout 65%', 'Case ABS'],
		image: '/api/products/p_39/image'
	},
	{
		id: 'p_40',
		name: 'Jasa Rakit PC Custom Premium',
		slug: 'jasa-rakit-pc-custom-premium',
		category: 'pc-rakitan',
		brand: 'TokoKomputer',
		price: 3_499_000,
		rating: 4.8,
		sold: 142,
		stock: 12,
		specs: ['Perakitan teknisi', 'Cable management', 'Stress test', 'Garansi rakitan'],
		image: '/api/products/p_40/image'
	},
	{
		id: 'p_41',
		name: 'TP-Link Switch Gigabit 48-Port Rackmount',
		slug: 'tp-link-switch-gigabit-48-port-rackmount',
		category: 'jaringan',
		brand: 'TP-Link',
		price: 429_000,
		rating: 4.7,
		sold: 1_680,
		stock: 80,
		specs: ['48 port Gigabit', 'Rackmount 19"', 'Unmanaged', 'Cat6 ready'],
		image: '/api/products/p_41/image'
	},
	{
		id: 'p_42',
		name: 'Cisco Catalyst Managed Switch 48-Port',
		slug: 'cisco-catalyst-managed-switch-48-port',
		category: 'jaringan',
		brand: 'Cisco',
		price: 1_349_000,
		originalPrice: 1_599_000,
		rating: 4.5,
		sold: 493,
		stock: 27,
		specs: ['48 port Gigabit', 'PoE+', 'Stackable', 'Enterprise'],
		image: '/api/products/p_42/image'
	},
	{
		id: 'p_43',
		name: 'Samsung Galaxy Buds2 Pro Graphite',
		slug: 'samsung-galaxy-buds2-pro-graphite',
		category: 'earphone',
		brand: 'Samsung',
		price: 1_899_000,
		rating: 4.8,
		sold: 218,
		stock: 15,
		specs: ['ANC', 'TWS', 'Bluetooth 5.3', 'Wireless charging case'],
		image: '/api/products/p_43/image'
	},
	{
		id: 'p_44',
		name: 'Razer Hammerhead True Wireless X',
		slug: 'razer-hammerhead-true-wireless-x',
		category: 'earphone',
		brand: 'Razer',
		price: 3_499_000,
		originalPrice: 3_999_000,
		rating: 4.8,
		sold: 540,
		stock: 21,
		specs: ['Low latency gaming', 'Bluetooth 5.2', 'IPX4', 'LED case'],
		image: '/api/products/p_44/image'
	},
	{
		id: 'p_45',
		name: 'Apple AirPods Pro 2 MagSafe Case',
		slug: 'apple-airpods-pro-2-magsafe-case',
		category: 'earphone',
		brand: 'Apple',
		price: 3_799_000,
		rating: 4.9,
		sold: 860,
		stock: 18,
		specs: ['ANC', 'Spatial Audio', 'MagSafe case', 'USB-C'],
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
