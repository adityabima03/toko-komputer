import { requireAdmin } from '#lib/server/auth.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const user = requireAdmin(locals, url);
	return { user };
};
