import { error, fail } from '@sveltejs/kit';
import { orderStatusEnum } from '#lib/server/db/schema.js';
import { findOrderByIdAny, findUserById, updateOrderStatus } from '#lib/server/data.js';
import type { OrderStatus } from '#lib/types.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const order = await findOrderByIdAny(params.id);
	if (!order) error(404, 'Pesanan tidak ditemukan');

	const customer = await findUserById(order.userId);
	return {
		order,
		customer: customer
			? { name: customer.name, email: customer.email }
			: { name: 'Pelanggan', email: '-' }
	};
};

export const actions = {
	status: async ({ request, params }) => {
		const formData = await request.formData();
		const nextStatus = String(formData.get('status') ?? '') as OrderStatus;

		if (!orderStatusEnum.includes(nextStatus)) {
			return fail(400, { statusError: 'Status tidak valid' });
		}

		const result = await updateOrderStatus(params.id, nextStatus);
		if (result.error === 'not_found') error(404, 'Pesanan tidak ditemukan');
		if (result.error === 'invalid_status') {
			return fail(400, { statusError: 'Perubahan status tidak diizinkan' });
		}

		return { statusOk: true, nextStatus };
	}
} satisfies Actions;
