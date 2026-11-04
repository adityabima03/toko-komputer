import { eq } from 'drizzle-orm';
import { db } from '#lib/server/db/index.js';
import { productImages, products } from '#lib/server/db/schema.js';

const EXT_BY_TYPE: Record<string, string> = {
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp',
	'image/gif': 'gif'
};

export function productImagePublicPath(productId: string) {
	return `/api/products/${productId}/image`;
}

export async function saveProductImageToDb(
	productId: string,
	input: { data: Buffer; mime: string }
) {
	if (!EXT_BY_TYPE[input.mime]) throw new Error('Tipe gambar tidak didukung');

	await db
		.insert(productImages)
		.values({
			productId,
			mime: input.mime,
			data: input.data
		})
		.onDuplicateKeyUpdate({
			set: {
				mime: input.mime,
				data: input.data
			}
		});

	const image = productImagePublicPath(productId);
	await db.update(products).set({ image }).where(eq(products.id, productId));
	return image;
}

export async function saveProductImageFile(productId: string, file: File) {
	const mime = file.type;
	const data = Buffer.from(await file.arrayBuffer());
	return saveProductImageToDb(productId, { data, mime });
}
