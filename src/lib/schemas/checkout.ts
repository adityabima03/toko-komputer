import { z } from 'zod';

const checkoutItemSchema = z.object({
	productId: z.string().min(1),
	qty: z.coerce.number().int().positive()
});

export const checkoutSchema = z.object({
	addressId: z.string().min(1, 'Pilih alamat pengiriman'),
	itemsJson: z.string().min(2, 'Keranjang kosong')
});

export function parseCheckoutItems(itemsJson: string) {
	let parsed: unknown;
	try {
		parsed = JSON.parse(itemsJson);
	} catch {
		return null;
	}

	const result = z.array(checkoutItemSchema).min(1).safeParse(parsed);
	return result.success ? result.data : null;
}

export type CheckoutItemInput = z.infer<typeof checkoutItemSchema>;
