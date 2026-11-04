import { json } from '@sveltejs/kit';
import { rejectBrowserNavigation } from '#lib/server/api-guard.js';
import { listCategories } from '#lib/server/data.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	rejectBrowserNavigation(request);
	return json({ categories: await listCategories() });
};
