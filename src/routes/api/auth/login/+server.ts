import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { loginSchema } from '#lib/schemas/auth.js';
import { findUserByEmail, toPublicUser, verifyPassword } from '#lib/server/data.js';
import { createSession } from '#lib/server/session.js';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body = await request.json().catch(() => null);
	const parsed = loginSchema.safeParse(body);

	if (!parsed.success) {
		return json(
			{ message: 'Data login tidak valid', errors: z.flattenError(parsed.error).fieldErrors },
			{ status: 400 }
		);
	}

	const { email, password, remember } = parsed.data;
	const user = findUserByEmail(email);

	if (!user || !verifyPassword(password, user.passwordHash)) {
		return json({ message: 'Email atau password salah' }, { status: 401 });
	}

	createSession(cookies, user.id, remember);

	return json({ user: toPublicUser(user) });
};
