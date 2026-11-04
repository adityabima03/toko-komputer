<script lang="ts">
	import { resolve } from '$app/paths';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { formatDateTime, formatRupiah } from '#lib/format.js';
	import { ORDER_STATUS_LABEL, ORDER_STATUS_VARIANT } from '#lib/order-status.js';
	import type { OrderStatus } from '#lib/types.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const filters: { value: OrderStatus | 'all'; label: string }[] = [
		{ value: 'all', label: 'Semua' },
		{ value: 'menunggu_pembayaran', label: 'Menunggu bayar' },
		{ value: 'dibayar', label: 'Dibayar' },
		{ value: 'dikirim', label: 'Dikirim' },
		{ value: 'selesai', label: 'Selesai' },
		{ value: 'dibatalkan', label: 'Dibatalkan' }
	];

	function hrefFor(status: OrderStatus | 'all') {
		return status === 'all'
			? resolve('/admin/pesanan')
			: `${resolve('/admin/pesanan')}?status=${status}`;
	}
</script>

<svelte:head>
	<title>Pesanan — Admin TokoKomputer</title>
</svelte:head>

<div class="space-y-4">
	<div class="flex flex-wrap items-end justify-between gap-3">
		<div>
			<h2 class="text-lg font-semibold">Pesanan masuk</h2>
			<p class="text-sm text-muted-foreground">{data.orders.length} pesanan ditampilkan</p>
		</div>
	</div>

	<div class="flex flex-wrap gap-2">
		{#each filters as filter (filter.value)}
			<Button
				size="sm"
				variant={data.status === filter.value ? 'default' : 'outline'}
				href={hrefFor(filter.value)}
			>
				{filter.label}
			</Button>
		{/each}
	</div>

	{#if data.orders.length === 0}
		<div class="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
			Belum ada pesanan untuk filter ini.
		</div>
	{:else}
		<div class="overflow-x-auto rounded-xl border">
			<table class="w-full min-w-[48rem] text-left text-sm">
				<thead class="border-b bg-muted/50 text-muted-foreground">
					<tr>
						<th class="px-4 py-3 font-medium">Pesanan</th>
						<th class="px-4 py-3 font-medium">Pelanggan</th>
						<th class="px-4 py-3 font-medium">Status</th>
						<th class="px-4 py-3 font-medium">Total</th>
						<th class="px-4 py-3 font-medium"></th>
					</tr>
				</thead>
				<tbody>
					{#each data.orders as order (order.id)}
						<tr class="border-b last:border-0">
							<td class="px-4 py-3">
								<p class="font-medium">#{order.id.slice(-8).toUpperCase()}</p>
								<p class="text-xs text-muted-foreground">
									{formatDateTime(order.createdAt)} · {order.itemCount} item
								</p>
								{#if order.paymentProof && order.status === 'menunggu_pembayaran'}
									<p class="mt-1 text-xs font-medium text-amber-700 dark:text-amber-400">
										Ada bukti transfer
									</p>
								{/if}
							</td>
							<td class="px-4 py-3">
								<p>{order.customerName}</p>
								<p class="text-xs text-muted-foreground">{order.customerEmail}</p>
							</td>
							<td class="px-4 py-3">
								<Badge variant={ORDER_STATUS_VARIANT[order.status]}>
									{ORDER_STATUS_LABEL[order.status]}
								</Badge>
							</td>
							<td class="px-4 py-3 tabular-nums">{formatRupiah(order.total)}</td>
							<td class="px-4 py-3 text-right">
								<Button
									href={resolve('/admin/pesanan/[id]', { id: order.id })}
									variant="ghost"
									size="sm"
								>
									Kelola
								</Button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
