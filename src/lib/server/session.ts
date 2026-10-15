import { randomBytes } from 'node:crypto';
import { and, eq, ne } from 'drizzle-orm';
import type { Cookies } from '@sveltejs/kit';
import { db } from './db/index.js';
import { sessions } from './db/schema.js';

export const SESSION_COOKIE = 'tk_session';

const DAY = 60 * 60 * 24;

export async function createSession(cookies: Cookies, userId: string, remember: boolean) {
	const id = randomBytes(32).toString('base64url');
	const maxAge = remember ? DAY * 30 : DAY;
	await db.insert(sessions).values({ id, userId, expiresAt: new Date(Date.now() + maxAge * 1000) });

	cookies.set(SESSION_COOKIE, id, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		...(remember ? { maxAge } : {})
	});
}

export async function getSessionUserId(cookies: Cookies) {
	const id = cookies.get(SESSION_COOKIE);
	if (!id) return null;

	const session = await db.query.sessions.findFirst({ where: eq(sessions.id, id) });
	if (!session) return null;

	if (session.expiresAt.getTime() < Date.now()) {
		await db.delete(sessions).where(eq(sessions.id, id));
		return null;
	}

	return session.userId;
}

/** Mengeluarkan user dari semua perangkat lain, session saat ini tetap aktif. */
export async function destroyOtherSessions(cookies: Cookies, userId: string) {
	const currentId = cookies.get(SESSION_COOKIE) ?? '';
	const removed = await db
		.delete(sessions)
		.where(and(eq(sessions.userId, userId), ne(sessions.id, currentId)))
		.returning({ id: sessions.id });
	return removed.length;
}

export async function destroySession(cookies: Cookies) {
	const id = cookies.get(SESSION_COOKIE);
	if (id) await db.delete(sessions).where(eq(sessions.id, id));
	cookies.delete(SESSION_COOKIE, { path: '/' });
}
