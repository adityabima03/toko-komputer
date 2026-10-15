import { json } from '@sveltejs/kit';
import { categories } from '#lib/server/data.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return json({ categories });
};
