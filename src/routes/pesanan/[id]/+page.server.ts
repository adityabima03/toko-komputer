import { error } from '@sveltejs/kit';
import { requireUser } from '#lib/server/auth.js';
import { findOrderById } from '#lib/server/data.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url, params }) => {
	const user = requireUser(locals, url);
	const order = await findOrderById(params.id, user.id);
	if (!order) error(404, 'Pesanan tidak ditemukan');
	return { order };
};
