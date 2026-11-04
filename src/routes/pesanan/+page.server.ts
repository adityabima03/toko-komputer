import { requireUser } from '#lib/server/auth.js';
import { listOrdersByUser } from '#lib/server/data.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const user = requireUser(locals, url);
	return { orders: await listOrdersByUser(user.id) };
};
