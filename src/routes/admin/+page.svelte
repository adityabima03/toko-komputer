<script lang="ts">
	import { resolve } from '$app/paths';
	import RiStoreLine from 'remixicon-svelte/icons/store-line';
	import RiShoppingBag3Line from 'remixicon-svelte/icons/shopping-bag-3-line';
	import RiUserLine from 'remixicon-svelte/icons/user-line';
	import RiErrorWarningLine from 'remixicon-svelte/icons/error-warning-line';
	import * as Card from '#lib/components/ui/card/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { formatRupiah } from '#lib/format.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const cards = $derived([
		{
			label: 'Pesanan',
			value: data.stats.orders,
			icon: RiShoppingBag3Line,
			href: resolve('/admin/pesanan')
		},
		{
			label: 'Menunggu bayar',
			value: data.stats.pendingOrders,
			icon: RiShoppingBag3Line,
			href: `${resolve('/admin/pesanan')}?status=menunggu_pembayaran`
		},
		{
			label: 'Produk',
			value: data.stats.products,
			icon: RiStoreLine,
			href: resolve('/admin/produk')
		},
		{
			label: 'Stok kritis',
			value: data.stats.lowStock + data.stats.outOfStock,
			icon: RiErrorWarningLine,
			href: resolve('/admin/produk')
		},
		{ label: 'Pengguna', value: data.stats.users, icon: RiUserLine, href: null as string | null }
	]);
</script>

<svelte:head>
	<title>Dashboard Admin — TokoKomputer</title>
</svelte:head>

<div class="space-y-6">
	<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
		{#each cards as card (card.label)}
			{#if card.href}
				<a
					href={card.href}
					class="block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
				>
					<Card.Root class="gap-3 py-4 transition-colors hover:bg-muted/40">
						<Card.Content class="flex items-center gap-3">
							<span
								class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary"
							>
								<card.icon class="size-5" />
							</span>
							<div>
								<p class="text-sm text-muted-foreground">{card.label}</p>
								<p class="text-2xl font-semibold tabular-nums">{card.value}</p>
							</div>
						</Card.Content>
					</Card.Root>
				</a>
			{:else}
				<Card.Root class="gap-3 py-4">
					<Card.Content class="flex items-center gap-3">
						<span
							class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary"
						>
							<card.icon class="size-5" />
						</span>
						<div>
							<p class="text-sm text-muted-foreground">{card.label}</p>
							<p class="text-2xl font-semibold tabular-nums">{card.value}</p>
						</div>
					</Card.Content>
				</Card.Root>
			{/if}
		{/each}
	</div>

	<div class="flex flex-wrap items-end justify-between gap-3">
		<div>
			<h2 class="text-lg font-semibold">Perlu perhatian</h2>
			<p class="text-sm text-muted-foreground">
				Produk stok habis atau sisa ≤ 5 unit ({data.stats.outOfStock} habis · {data.stats.lowStock}
				menipis)
			</p>
		</div>
		<Button href={resolve('/admin/produk')} variant="outline" size="sm">Lihat semua produk</Button>
	</div>

	{#if data.attention.length === 0}
		<div class="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
			Semua stok masih aman.
		</div>
	{:else}
		<div class="overflow-x-auto rounded-xl border">
			<table class="w-full min-w-[36rem] text-left text-sm">
				<thead class="border-b bg-muted/50 text-muted-foreground">
					<tr>
						<th class="px-4 py-3 font-medium">Produk</th>
						<th class="px-4 py-3 font-medium">Kategori</th>
						<th class="px-4 py-3 font-medium">Harga</th>
						<th class="px-4 py-3 font-medium">Stok</th>
					</tr>
				</thead>
				<tbody>
					{#each data.attention as product (product.id)}
						<tr class="border-b last:border-0">
							<td class="px-4 py-3">
								<p class="font-medium">{product.name}</p>
								<p class="text-xs text-muted-foreground">{product.brand}</p>
							</td>
							<td class="px-4 py-3 text-muted-foreground"
								>{product.categoryName ?? product.category}</td
							>
							<td class="px-4 py-3 tabular-nums">{formatRupiah(product.price)}</td>
							<td class="px-4 py-3">
								{#if product.stock === 0}
									<Badge variant="destructive">Habis</Badge>
								{:else}
									<Badge variant="secondary">{product.stock} tersisa</Badge>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
