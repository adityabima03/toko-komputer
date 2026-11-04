import { json } from '@sveltejs/kit';
import { rejectBrowserNavigation } from '#lib/server/api-guard.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, locals }) => {
	rejectBrowserNavigation(request);
	if (!locals.user) {
		return json({ message: 'Belum login' }, { status: 401 });
	}

	return json({ user: locals.user });
};
