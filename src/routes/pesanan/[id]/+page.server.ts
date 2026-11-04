import { error, fail } from '@sveltejs/kit';
import {
	ALLOWED_PAYMENT_PROOF_TYPES,
	MAX_PAYMENT_PROOF_BYTES
} from '#lib/payment.js';
import { requireUser } from '#lib/server/auth.js';
import {
	cancelOrder,
	findOrderById,
	markOrderPaid,
	submitPaymentProof
} from '#lib/server/data.js';
import { savePaymentProof } from '#lib/server/upload.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url, params }) => {
	const user = requireUser(locals, url);
	const order = await findOrderById(params.id, user.id);
	if (!order) error(404, 'Pesanan tidak ditemukan');
	return { order };
};

export const actions = {
	simulatePay: async ({ locals, url, params }) => {
		const user = requireUser(locals, url);
		const result = await markOrderPaid(params.id, user.id);
		if (result.error === 'not_found') error(404, 'Pesanan tidak ditemukan');
		if (result.error === 'invalid_status') {
			return fail(400, { payError: 'Pesanan ini sudah tidak menunggu pembayaran' });
		}
		return { payOk: true };
	},

	uploadProof: async ({ request, locals, url, params }) => {
		const user = requireUser(locals, url);
		const formData = await request.formData();
		const file = formData.get('proof');

		if (!(file instanceof File) || file.size === 0) {
			return fail(400, { proofError: 'Pilih file bukti transfer' });
		}
		if (
			!ALLOWED_PAYMENT_PROOF_TYPES.includes(
				file.type as (typeof ALLOWED_PAYMENT_PROOF_TYPES)[number]
			)
		) {
			return fail(400, { proofError: 'Format harus JPG, PNG, WEBP, atau GIF' });
		}
		if (file.size > MAX_PAYMENT_PROOF_BYTES) {
			return fail(400, { proofError: 'Ukuran file maksimal 2 MB' });
		}

		let proofUrl: string;
		try {
			proofUrl = await savePaymentProof(file);
		} catch {
			return fail(400, { proofError: 'Gagal menyimpan bukti, coba file lain' });
		}

		const result = await submitPaymentProof(params.id, user.id, proofUrl);
		if (result.error === 'not_found') error(404, 'Pesanan tidak ditemukan');
		if (result.error === 'invalid_status') {
			return fail(400, { proofError: 'Pesanan ini sudah tidak menunggu pembayaran' });
		}

		return { proofOk: true };
	},

	cancel: async ({ locals, url, params }) => {
		const user = requireUser(locals, url);
		const result = await cancelOrder(params.id, user.id);
		if (result.error === 'not_found') error(404, 'Pesanan tidak ditemukan');
		if (result.error === 'invalid_status') {
			return fail(400, { cancelError: 'Pesanan ini tidak bisa dibatalkan' });
		}
		return { cancelOk: true };
	}
} satisfies Actions;
