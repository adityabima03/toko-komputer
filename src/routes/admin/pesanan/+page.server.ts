import { listAdminOrders } from '#lib/server/data.js';
import type { OrderStatus } from '#lib/types.js';
import type { PageServerLoad } from './$types';

const statuses = [
	'all',
	'menunggu_pembayaran',
	'dibayar',
	'dikirim',
	'selesai',
	'dibatalkan'
] as const;

export const load: PageServerLoad = async ({ url }) => {
	const raw = url.searchParams.get('status') ?? 'all';
	const status = (statuses.includes(raw as (typeof statuses)[number])
		? raw
		: 'all') as OrderStatus | 'all';

	return {
		status,
		orders: await listAdminOrders(status)
	};
};
