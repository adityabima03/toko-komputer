import { json } from '@sveltejs/kit';
import { listBrands } from '#lib/server/data.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	return json({ brands: await listBrands(url.searchParams.get('category')) });
};
