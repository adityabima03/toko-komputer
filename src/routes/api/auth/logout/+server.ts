import { json } from '@sveltejs/kit';
import { rejectBrowserNavigation } from '#lib/server/api-guard.js';
import { destroySession } from '#lib/server/session.js';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	rejectBrowserNavigation(request);
	await destroySession(cookies);
	return json({ ok: true });
};
