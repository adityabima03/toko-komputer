import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from 'node:crypto';

const KEY_LENGTH = 64;
const SALT_BYTES = 16;

// OWASP Password Storage Cheat Sheet: jika Argon2id tidak tersedia, scrypt minimum
// N=2^17, r=8, p=1 (sekitar 128 MiB). Parameter disimpan di hash agar nilai lama tetap bisa dicek.
const COST = 2 ** 17;
const BLOCK_SIZE = 8;
const PARALLELIZATION = 1;

const LEGACY_COST = 2 ** 14;
const LEGACY_BLOCK_SIZE = 8;
const LEGACY_PARALLELIZATION = 1;

// Node menolak scrypt bila 128 * N * r > maxmem. Bawaan Node 32 MiB, kebutuhan parameter ini 128 MiB.
const MAXMEM = 256 * 1024 * 1024;

const ALLOWED_PARAMS: ReadonlyArray<readonly [number, number, number]> = [
	[COST, BLOCK_SIZE, PARALLELIZATION],
	[2 ** 16, 8, 2],
	[2 ** 15, 8, 3],
	[2 ** 14, 8, 5],
	[2 ** 13, 8, 10],
	[LEGACY_COST, LEGACY_BLOCK_SIZE, LEGACY_PARALLELIZATION]
];

type ParsedHash = {
	cost: number;
	blockSize: number;
	parallelization: number;
	salt: Buffer | string;
	hash: Buffer;
};

function isAllowed(cost: number, blockSize: number, parallelization: number) {
	return ALLOWED_PARAMS.some(([n, r, p]) => cost === n && blockSize === r && parallelization === p);
}

function parseStored(stored: string): ParsedHash | null {
	const versioned = /^scrypt\$(\d+)\$(\d+)\$(\d+)\$([0-9a-f]{32})\$([0-9a-f]{128})$/i.exec(stored);
	if (versioned) {
		const cost = Number(versioned[1]);
		const blockSize = Number(versioned[2]);
		const parallelization = Number(versioned[3]);
		if (!isAllowed(cost, blockSize, parallelization)) return null;
		return {
			cost,
			blockSize,
			parallelization,
			salt: Buffer.from(versioned[4], 'hex'),
			hash: Buffer.from(versioned[5], 'hex')
		};
	}

	// Hash sebelum parameter OWASP: salt hex 16 byte dikirim sebagai string, N bawaan Node.
	const legacy = /^([0-9a-f]{32}):([0-9a-f]{128})$/i.exec(stored);
	if (!legacy) return null;
	return {
		cost: LEGACY_COST,
		blockSize: LEGACY_BLOCK_SIZE,
		parallelization: LEGACY_PARALLELIZATION,
		salt: legacy[1],
		hash: Buffer.from(legacy[2], 'hex')
	};
}

function derive(password: string, parsed: ParsedHash) {
	const options: ScryptOptions = {
		cost: parsed.cost,
		blockSize: parsed.blockSize,
		parallelization: parsed.parallelization,
		maxmem: MAXMEM
	};

	return new Promise<Buffer>((resolve, reject) => {
		scrypt(password, parsed.salt, KEY_LENGTH, options, (error, derived) => {
			if (error) reject(error);
			else resolve(derived);
		});
	});
}

export async function hashPassword(password: string) {
	const salt = randomBytes(SALT_BYTES);
	const hash = await derive(password, {
		cost: COST,
		blockSize: BLOCK_SIZE,
		parallelization: PARALLELIZATION,
		salt,
		hash: Buffer.alloc(0)
	});
	return `scrypt$${COST}$${BLOCK_SIZE}$${PARALLELIZATION}$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export async function verifyPassword(password: string, stored: string) {
	const parsed = parseStored(stored);
	if (!parsed) return false;

	const actual = await derive(password, parsed);
	return actual.length === parsed.hash.length && timingSafeEqual(actual, parsed.hash);
}

export function passwordNeedsRehash(stored: string) {
	const parsed = parseStored(stored);
	if (!parsed || typeof parsed.salt === 'string') return true;
	return (
		parsed.cost !== COST ||
		parsed.blockSize !== BLOCK_SIZE ||
		parsed.parallelization !== PARALLELIZATION
	);
}
