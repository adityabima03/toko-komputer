const rupiah = new Intl.NumberFormat('id-ID', {
	style: 'currency',
	currency: 'IDR',
	maximumFractionDigits: 0
});

const compact = new Intl.NumberFormat('id-ID', { notation: 'compact' });

export const formatRupiah = (value: number) => rupiah.format(value);

export const formatCompact = (value: number) => compact.format(value);

export function discountPercent(price: number, originalPrice?: number) {
	if (!originalPrice || originalPrice <= price) return 0;
	return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function initials(name: string) {
	return name
		.split(' ')
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]!.toUpperCase())
		.join('');
}
