import type { Handle } from '@sveltejs/kit/hooks';
import { findUserById, toPublicUser } from '#lib/server/data.js';
import { getSessionUserId } from '#lib/server/session.js';

export const handle: Handle = async ({ event, resolve }) => {
	const userId = await getSessionUserId(event.cookies);
	const user = userId ? await findUserById(userId) : undefined;
	event.locals.user = user ? toPublicUser(user) : null;

	return resolve(event);
};
