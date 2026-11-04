import { fail } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { addressSchema } from '#lib/schemas/address.js';
import { passwordSchema, profileSchema } from '#lib/schemas/profile.js';
import { requireUser } from '#lib/server/auth.js';
import {
	createAddress,
	deleteAddress,
	findUserById,
	isEmailTaken,
	listAddresses,
	setDefaultAddress,
	updateAddress,
	updateUserPassword,
	updateUserProfile
} from '#lib/server/data.js';
import { hashPassword, verifyPassword } from '#lib/server/password.js';
import { destroyOtherSessions } from '#lib/server/session.js';
import type { Actions, PageServerLoad } from './$types';

const emptyAddress = {
	label: 'Rumah',
	recipientName: '',
	phone: '',
	addressLine: '',
	city: '',
	province: '',
	postalCode: '',
	isDefault: false
};

export const load: PageServerLoad = async ({ locals, url }) => {
	const user = requireUser(locals, url);
	const addresses = await listAddresses(user.id);

	return {
		addresses,
		profileForm: await superValidate({ name: user.name, email: user.email }, zod4(profileSchema), {
			id: 'profile'
		}),
		passwordForm: await superValidate(zod4(passwordSchema), { id: 'password' }),
		addressForm: await superValidate(
			{ ...emptyAddress, recipientName: user.name },
			zod4(addressSchema),
			{ id: 'address' }
		)
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
	},

	addressCreate: async ({ request, locals, url }) => {
		const user = requireUser(locals, url);
		const form = await superValidate(request, zod4(addressSchema), { id: 'address' });
		if (!form.valid) return fail(400, { form });

		const created = await createAddress(user.id, form.data);
		if (!created) return message(form, 'Gagal menyimpan alamat', { status: 500 });

		return message(form, 'Alamat berhasil ditambahkan');
	},

	addressUpdate: async ({ request, locals, url }) => {
		const user = requireUser(locals, url);
		const formData = await request.formData();
		const addressId = String(formData.get('addressId') ?? '');
		const form = await superValidate(formData, zod4(addressSchema), { id: 'address' });
		if (!form.valid) return fail(400, { form });
		if (!addressId) return message(form, 'Alamat tidak ditemukan', { status: 400 });

		const updated = await updateAddress(addressId, user.id, form.data);
		if (!updated) return message(form, 'Alamat tidak ditemukan', { status: 404 });

		return message(form, 'Alamat berhasil diperbarui');
	},

	addressDefault: async ({ request, locals, url }) => {
		const user = requireUser(locals, url);
		const formData = await request.formData();
		const addressId = String(formData.get('addressId') ?? '');
		if (!addressId || !(await setDefaultAddress(addressId, user.id))) {
			return fail(400, { addressError: 'Alamat tidak ditemukan' });
		}
		return { success: true };
	},

	addressDelete: async ({ request, locals, url }) => {
		const user = requireUser(locals, url);
		const formData = await request.formData();
		const addressId = String(formData.get('addressId') ?? '');
		if (!addressId || !(await deleteAddress(addressId, user.id))) {
			return fail(400, { addressError: 'Alamat tidak ditemukan' });
		}
		return { success: true };
	}
} satisfies Actions;
