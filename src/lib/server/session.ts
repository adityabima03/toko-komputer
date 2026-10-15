import { randomBytes } from 'node:crypto';
import type { Cookies } from '@sveltejs/kit';

export const SESSION_COOKIE = 'tk_session';

const DAY = 60 * 60 * 24;

type Session = { userId: string; expiresAt: number };

// In-memory store: sessions are lost when the server restarts. Replace with a DB/Redis in production.
const sessions = new Map<string, Session>();

export function createSession(cookies: Cookies, userId: string, remember: boolean) {
	const id = randomBytes(32).toString('base64url');
	const maxAge = remember ? DAY * 30 : DAY;
	sessions.set(id, { userId, expiresAt: Date.now() + maxAge * 1000 });

	cookies.set(SESSION_COOKIE, id, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		...(remember ? { maxAge } : {})
	});
}

export function getSessionUserId(cookies: Cookies) {
	const id = cookies.get(SESSION_COOKIE);
	if (!id) return null;

	const session = sessions.get(id);
	if (!session) return null;

	if (session.expiresAt < Date.now()) {
		sessions.delete(id);
		return null;
	}

	return session.userId;
}

export function destroySession(cookies: Cookies) {
	const id = cookies.get(SESSION_COOKIE);
	if (id) sessions.delete(id);
	cookies.delete(SESSION_COOKIE, { path: '/' });
}
