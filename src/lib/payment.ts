/** Rekening tujuan transfer manual (sandbox lokal). */
export const BANK_TRANSFER = {
	bank: 'BCA',
	accountNumber: '1234567890',
	accountName: 'Toko Komputer'
} as const;

export const MAX_PAYMENT_PROOF_BYTES = 2 * 1024 * 1024;
export const ALLOWED_PAYMENT_PROOF_TYPES = [
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/gif'
] as const;
