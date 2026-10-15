import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { safeRedirect } from '#lib/redirect.js';
import { loginSchema } from '#lib/schemas/auth.js';
import { findUserByEmail, verifyPassword } from '#lib/server/data.js';
import { createSession } from '#lib/server/session.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user) {
		redirect(303, safeRedirect(url.searchParams.get('redirectTo')));
	}

	return { form: await superValidate(zod4(loginSchema)) };
};

export const actions = {
	default: async ({ request, cookies, url }) => {
		const form = await superValidate(request, zod4(loginSchema));
		if (!form.valid) return fail(400, { form });

		const { email, password, remember } = form.data;
		const user = await findUserByEmail(email);

		if (!user || !verifyPassword(password, user.passwordHash)) {
			form.data.password = '';
			return message(form, 'Email atau password salah', { status: 401 });
		}

		await createSession(cookies, user.id, remember);
		redirect(303, safeRedirect(url.searchParams.get('redirectTo')));
	}
} satisfies Actions;
