import { redirect } from '@sveltejs/kit';
import type { User } from '#lib/types.js';

export function requireUser(locals: App.Locals, url: URL): User {
	if (!locals.user) {
		redirect(303, `/login?redirectTo=${encodeURIComponent(url.pathname)}`);
	}
	return locals.user;
}

export function requireAdmin(locals: App.Locals, url: URL): User {
	const user = requireUser(locals, url);
	if (user.role !== 'admin') {
		// Redirect ramah, bukan 403 polos — customer tetap di alur toko.
		redirect(303, '/?notice=admin-only');
	}
	return user;
}
