import { json } from '@sveltejs/kit';
import { destroySession } from '#lib/server/session.js';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	await destroySession(cookies);
	return json({ ok: true });
};
