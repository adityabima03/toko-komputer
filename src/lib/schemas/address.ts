import { z } from 'zod';

export const addressSchema = z.object({
	label: z
		.string()
		.trim()
		.min(1, 'Label wajib diisi')
		.max(40, 'Label maksimal 40 karakter'),
	recipientName: z
		.string()
		.trim()
		.min(2, 'Nama penerima minimal 2 karakter')
		.max(120, 'Nama penerima maksimal 120 karakter'),
	phone: z
		.string()
		.trim()
		.min(10, 'Nomor telepon minimal 10 digit')
		.max(20, 'Nomor telepon maksimal 20 karakter')
		.regex(/^[0-9+\-\s()]+$/, 'Nomor telepon tidak valid'),
	addressLine: z
		.string()
		.trim()
		.min(5, 'Alamat minimal 5 karakter')
		.max(255, 'Alamat maksimal 255 karakter'),
	city: z.string().trim().min(2, 'Kota wajib diisi').max(100, 'Kota maksimal 100 karakter'),
	province: z
		.string()
		.trim()
		.min(2, 'Provinsi wajib diisi')
		.max(100, 'Provinsi maksimal 100 karakter'),
	postalCode: z
		.string()
		.trim()
		.min(5, 'Kode pos minimal 5 digit')
		.max(10, 'Kode pos maksimal 10 karakter')
		.regex(/^[0-9]+$/, 'Kode pos hanya boleh angka'),
	isDefault: z.boolean().default(false)
});

export type AddressInput = z.infer<typeof addressSchema>;
