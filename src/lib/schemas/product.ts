import { z } from 'zod';

export const createProductSchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(2, 'Nama produk minimal 2 karakter')
			.max(190, 'Nama produk maksimal 190 karakter'),
		slug: z
			.string()
			.trim()
			.max(190, 'Slug maksimal 190 karakter')
			.regex(
				/^[a-z0-9]+(?:-[a-z0-9]+)*$|^$/,
				'Slug hanya boleh huruf kecil, angka, dan tanda hubung'
			)
			.default(''),
		category: z.string().min(1, 'Kategori wajib dipilih'),
		brand: z.string().trim().min(1, 'Brand wajib diisi').max(120, 'Brand maksimal 120 karakter'),
		price: z.coerce.number().int().positive('Harga harus lebih dari 0'),
		originalPrice: z.string().trim().default(''),
		stock: z.coerce.number().int().min(0, 'Stok tidak boleh negatif').default(0),
		specs: z.string().trim().default(''),
		image: z.string().trim().url('URL gambar tidak valid').max(500, 'URL gambar terlalu panjang')
	})
	.superRefine((data, ctx) => {
		if (!data.originalPrice) return;

		const originalPrice = Number(data.originalPrice);
		if (!Number.isInteger(originalPrice) || originalPrice <= 0) {
			ctx.addIssue({
				code: 'custom',
				message: 'Harga coret harus lebih dari 0',
				path: ['originalPrice']
			});
			return;
		}

		if (originalPrice <= data.price) {
			ctx.addIssue({
				code: 'custom',
				message: 'Harga coret harus lebih tinggi dari harga jual',
				path: ['originalPrice']
			});
		}
	});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export function parseOptionalPrice(value: string) {
	if (!value.trim()) return undefined;
	return Number(value);
}
