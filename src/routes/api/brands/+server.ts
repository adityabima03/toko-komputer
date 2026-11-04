import { json } from '@sveltejs/kit';
import { rejectBrowserNavigation } from '#lib/server/api-guard.js';
import { listBrands } from '#lib/server/data.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, url }) => {
	rejectBrowserNavigation(request);
	return json({ brands: await listBrands(url.searchParams.get('category')) });
};
