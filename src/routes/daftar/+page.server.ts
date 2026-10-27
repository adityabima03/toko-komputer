import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { safeRedirect } from '#lib/redirect.js';
import { registerSchema } from '#lib/schemas/auth.js';
import { createUser } from '#lib/server/data.js';
import { createSession } from '#lib/server/session.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user) {
		redirect(303, safeRedirect(url.searchParams.get('redirectTo')));
	}

	return { form: await superValidate(zod4(registerSchema)) };
};

export const actions = {
	default: async ({ request, cookies, url }) => {
		const form = await superValidate(request, zod4(registerSchema));
		if (!form.valid) return fail(400, { form });

		const { name, email, password, remember } = form.data;
		const user = await createUser({ name, email, password });

		if (!user) {
			form.data.password = '';
			form.data.confirmPassword = '';
			return message(form, 'Email sudah terdaftar. Silakan masuk atau pakai email lain.', {
				status: 409
			});
		}

		await createSession(cookies, user.id, remember);
		redirect(303, safeRedirect(url.searchParams.get('redirectTo')));
	}
} satisfies Actions;
