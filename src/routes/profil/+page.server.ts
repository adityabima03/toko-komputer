import { fail, redirect } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { passwordSchema, profileSchema } from '#lib/schemas/profile.js';
import {
	findUserById,
	isEmailTaken,
	updateUserPassword,
	updateUserProfile
} from '#lib/server/data.js';
import { hashPassword, verifyPassword } from '#lib/server/password.js';
import { destroyOtherSessions } from '#lib/server/session.js';
import type { Actions, PageServerLoad } from './$types';

function requireUser(locals: App.Locals, url: URL) {
	if (!locals.user) {
		redirect(303, `/login?redirectTo=${encodeURIComponent(url.pathname)}`);
	}
	return locals.user;
}

export const load: PageServerLoad = async ({ locals, url }) => {
	const user = requireUser(locals, url);

	return {
		profileForm: await superValidate({ name: user.name, email: user.email }, zod4(profileSchema), {
			id: 'profile'
		}),
		passwordForm: await superValidate(zod4(passwordSchema), { id: 'password' })
	};
};

export const actions = {
	profile: async ({ request, locals, url }) => {
		const user = requireUser(locals, url);
		const form = await superValidate(request, zod4(profileSchema), { id: 'profile' });
		if (!form.valid) return fail(400, { form });

		if (await isEmailTaken(form.data.email, user.id)) {
			return setError(form, 'email', 'Email sudah dipakai akun lain');
		}

		form.data.email = form.data.email.toLowerCase();
		await updateUserProfile(user.id, form.data);
		return message(form, 'Profil berhasil diperbarui');
	},

	password: async ({ request, locals, url, cookies }) => {
		const { id } = requireUser(locals, url);
		const form = await superValidate(request, zod4(passwordSchema), { id: 'password' });
		if (!form.valid) return fail(400, { form });

		const user = await findUserById(id);
		if (!user || !verifyPassword(form.data.currentPassword, user.passwordHash)) {
			form.data.currentPassword = '';
			return setError(form, 'currentPassword', 'Password saat ini salah');
		}

		await updateUserPassword(user.id, hashPassword(form.data.newPassword));
		const loggedOut = await destroyOtherSessions(cookies, user.id);

		form.data = { currentPassword: '', newPassword: '', confirmPassword: '' };
		return message(
			form,
			loggedOut > 0
				? `Password berhasil diganti. ${loggedOut} perangkat lain telah dikeluarkan.`
				: 'Password berhasil diganti'
		);
	}
} satisfies Actions;
