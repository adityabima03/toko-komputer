import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '#lib/server/db/index.js';
import { productImages } from '#lib/server/db/schema.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const row = await db.query.productImages.findFirst({
		where: eq(productImages.productId, params.id)
	});
	if (!row) error(404, 'Gambar tidak ditemukan');

	return new Response(new Uint8Array(row.data), {
		headers: {
			'Content-Type': row.mime,
			'Cache-Control': 'public, max-age=86400'
		}
	});
};
