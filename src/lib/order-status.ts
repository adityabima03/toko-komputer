import type { OrderStatus } from '#lib/types.js';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
	menunggu_pembayaran: 'Menunggu pembayaran',
	dibayar: 'Dibayar',
	dikirim: 'Dikirim',
	selesai: 'Selesai',
	dibatalkan: 'Dibatalkan'
};

export const ORDER_STATUS_VARIANT: Record<
	OrderStatus,
	'default' | 'secondary' | 'destructive' | 'outline'
> = {
	menunggu_pembayaran: 'secondary',
	dibayar: 'default',
	dikirim: 'default',
	selesai: 'outline',
	dibatalkan: 'destructive'
};

/** Transisi status yang boleh dilakukan admin. */
export const ADMIN_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
	menunggu_pembayaran: ['dibayar', 'dibatalkan'],
	dibayar: ['dikirim', 'dibatalkan'],
	dikirim: ['selesai'],
	selesai: [],
	dibatalkan: []
};

export function canAdminSetStatus(from: OrderStatus, to: OrderStatus) {
	return ADMIN_STATUS_TRANSITIONS[from].includes(to);
}
