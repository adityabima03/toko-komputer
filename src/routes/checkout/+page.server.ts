import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { checkoutSchema, parseCheckoutItems } from '#lib/schemas/checkout.js';
import { requireUser } from '#lib/server/auth.js';
import { createOrder, listAddresses, listProducts } from '#lib/server/data.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const user = requireUser(locals, url);
	const [addresses, products] = await Promise.all([listAddresses(user.id), listProducts()]);
	const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];

	return {
		addresses,
		products,
		form: await superValidate(
			{
				addressId: defaultAddress?.id ?? '',
				itemsJson: '[]'
			},
			zod4(checkoutSchema)
		)
	};
};

export const actions = {
	default: async ({ request, locals, url }) => {
		const user = requireUser(locals, url);
		const form = await superValidate(request, zod4(checkoutSchema));
		if (!form.valid) return fail(400, { form });

		const items = parseCheckoutItems(form.data.itemsJson);
		if (!items) {
			return message(form, 'Data keranjang tidak valid. Muat ulang halaman lalu coba lagi.', {
				status: 400
			});
		}

		const result = await createOrder(user.id, form.data.addressId, items);

		if ('error' in result) {
			const messages = {
				empty: 'Keranjang kosong',
				address: 'Alamat pengiriman tidak ditemukan. Pilih atau tambah alamat dulu.',
				product_missing: result.message ?? 'Ada produk yang sudah tidak tersedia',
				stock: result.message ?? 'Stok tidak mencukupi',
				failed: 'Gagal membuat pesanan. Coba lagi sebentar.'
			} as const;

			return message(form, messages[result.error], { status: 400 });
		}

		redirect(303, `/pesanan/${result.order.id}?created=1#bayar`);
	}
} satisfies Actions;
