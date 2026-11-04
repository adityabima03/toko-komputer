/** Ambang subtotal (harga jual) untuk gratis ongkir. */
export const FREE_SHIPPING_MIN = 1_000_000;

/** Ongkir tetap jika subtotal di bawah ambang gratis. */
export const SHIPPING_FEE = 15_000;

export function calcShippingFee(subtotal: number) {
	return subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
}
