import { z } from 'zod';

export const MAX_PRODUCT_IMAGE_BYTES = 2 * 1024 * 1024;
export const ALLOWED_PRODUCT_IMAGE_TYPES = [
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/gif'
] as const;

function hasUploadedFile(value: unknown): value is File {
	return typeof File !== 'undefined' && value instanceof File && value.size > 0;
}

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
		imageUrl: z.string().trim().default(''),
		imageFile: z.any().optional()
	})
	.superRefine((data, ctx) => {
		if (data.originalPrice) {
			const originalPrice = Number(data.originalPrice);
			if (!Number.isInteger(originalPrice) || originalPrice <= 0) {
				ctx.addIssue({
					code: 'custom',
					message: 'Harga coret harus lebih dari 0',
					path: ['originalPrice']
				});
			} else if (originalPrice <= data.price) {
				ctx.addIssue({
					code: 'custom',
					message: 'Harga coret harus lebih tinggi dari harga jual',
					path: ['originalPrice']
				});
			}
		}

		const hasUrl = data.imageUrl.length > 0;
		const hasFile = hasUploadedFile(data.imageFile);

		if (!hasUrl && !hasFile) {
			ctx.addIssue({
				code: 'custom',
				message: 'Upload gambar atau isi URL gambar',
				path: ['imageFile']
			});
			return;
		}

		if (hasUrl) {
			const parsed = z.url('URL gambar tidak valid').safeParse(data.imageUrl);
			if (!parsed.success) {
				ctx.addIssue({
					code: 'custom',
					message: 'URL gambar tidak valid',
					path: ['imageUrl']
				});
			} else if (data.imageUrl.length > 500) {
				ctx.addIssue({
					code: 'custom',
					message: 'URL gambar terlalu panjang',
					path: ['imageUrl']
				});
			}
		}

		if (hasFile) {
			if (
				!ALLOWED_PRODUCT_IMAGE_TYPES.includes(
					data.imageFile.type as (typeof ALLOWED_PRODUCT_IMAGE_TYPES)[number]
				)
			) {
				ctx.addIssue({
					code: 'custom',
					message: 'Format gambar harus JPG, PNG, WEBP, atau GIF',
					path: ['imageFile']
				});
			}
			if (data.imageFile.size > MAX_PRODUCT_IMAGE_BYTES) {
				ctx.addIssue({
					code: 'custom',
					message: 'Ukuran gambar maksimal 2 MB',
					path: ['imageFile']
				});
			}
		}
	});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export function parseOptionalPrice(value: string) {
	if (!value.trim()) return undefined;
	return Number(value);
}

export function hasUploadedFileValue(value: unknown): value is File {
	return hasUploadedFile(value);
}
