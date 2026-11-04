<script lang="ts">
	import { resolve } from '$app/paths';
	import RiArrowLeftLine from 'remixicon-svelte/icons/arrow-left-line';
	import RiShoppingBag3Line from 'remixicon-svelte/icons/shopping-bag-3-line';
	import SiteHeader from '#lib/components/site-header.svelte';
	import * as Card from '#lib/components/ui/card/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { formatDateTime, formatRupiah } from '#lib/format.js';
	import { ORDER_STATUS_LABEL, ORDER_STATUS_VARIANT } from '#lib/order-status.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Pesanan Saya — TokoKomputer</title>
</svelte:head>

<SiteHeader user={data.user} showSearch={false} />

<main class="container mx-auto max-w-4xl px-4 py-8 md:py-12">
	<Button variant="ghost" size="sm" href={resolve('/')} class="mb-3 -ml-2.5">
		<RiArrowLeftLine data-icon="inline-start" /> Kembali ke toko
	</Button>

	<div class="mb-6">
		<h1 class="text-2xl font-bold tracking-tight">Pesanan Saya</h1>
		<p class="text-sm text-muted-foreground">{data.orders.length} pesanan</p>
	</div>

	{#if data.orders.length === 0}
		<div
			class="flex flex-col items-center gap-3 rounded-xl border border-dashed px-4 py-20 text-center"
		>
			<span
				class="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary"
			>
				<RiShoppingBag3Line class="size-7" />
			</span>
			<div>
				<p class="font-medium">Belum ada pesanan</p>
				<p class="text-sm text-muted-foreground">Pesananmu akan muncul di sini setelah checkout.</p>
			</div>
			<Button href={resolve('/')} class="mt-2">Mulai Belanja</Button>
		</div>
	{:else}
		<ul class="grid gap-4">
			{#each data.orders as order (order.id)}
				<li>
					<a href={resolve('/pesanan/[id]', { id: order.id })} class="block">
						<Card.Root class="transition-colors hover:bg-muted/30">
							<Card.Content class="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
								<div class="min-w-0 space-y-2">
									<div class="flex flex-wrap items-center gap-2">
										<p class="font-medium">#{order.id.slice(-8).toUpperCase()}</p>
										<Badge variant={ORDER_STATUS_VARIANT[order.status]}>
											{ORDER_STATUS_LABEL[order.status]}
										</Badge>
									</div>
									<p class="text-sm text-muted-foreground">
										{formatDateTime(order.createdAt)} · {order.items.reduce((n, i) => n + i.qty, 0)}
										item · {order.city}
									</p>
									<p class="line-clamp-1 text-sm text-muted-foreground">
										{order.items.map((i) => i.productName).join(', ')}
									</p>
								</div>
								<div class="shrink-0 text-left sm:text-right">
									<p class="text-sm text-muted-foreground">Total</p>
									<p class="text-lg font-semibold tabular-nums">{formatRupiah(order.total)}</p>
								</div>
							</Card.Content>
						</Card.Root>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</main>
