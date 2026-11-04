<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';
	import RiArrowLeftLine from 'remixicon-svelte/icons/arrow-left-line';
	import SiteHeader from '#lib/components/site-header.svelte';
	import * as Card from '#lib/components/ui/card/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Separator } from '#lib/components/ui/separator/index.js';
	import { formatDateTime, formatRupiah } from '#lib/format.js';
	import { ORDER_STATUS_LABEL, ORDER_STATUS_VARIANT } from '#lib/order-status.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	$effect(() => {
		const created = page.url.searchParams.get('created');
		if (!created) return;
		toast.success('Pesanan berhasil dibuat', {
			description: 'Status saat ini: menunggu pembayaran.'
		});
		history.replaceState({}, '', resolve('/pesanan/[id]', { id: data.order.id }));
	});
</script>

<svelte:head>
	<title>Pesanan #{data.order.id.slice(-8).toUpperCase()} — TokoKomputer</title>
</svelte:head>

<SiteHeader user={data.user} showSearch={false} />

<main class="container mx-auto max-w-4xl px-4 py-8 md:py-12">
	<Button variant="ghost" size="sm" href={resolve('/pesanan')} class="mb-3 -ml-2.5">
		<RiArrowLeftLine data-icon="inline-start" /> Semua pesanan
	</Button>

	<div class="mb-6 flex flex-wrap items-end justify-between gap-3">
		<div>
			<div class="mb-1 flex flex-wrap items-center gap-2">
				<h1 class="text-2xl font-bold tracking-tight">
					Pesanan #{data.order.id.slice(-8).toUpperCase()}
				</h1>
				<Badge variant={ORDER_STATUS_VARIANT[data.order.status]}>
					{ORDER_STATUS_LABEL[data.order.status]}
				</Badge>
			</div>
			<p class="text-sm text-muted-foreground">
				Dibuat {formatDateTime(data.order.createdAt)}
			</p>
		</div>
		{#if data.order.status === 'menunggu_pembayaran'}
			<p class="rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-200">
				Menunggu pembayaran — fitur bayar segera hadir.
			</p>
		{/if}
	</div>

	<div class="grid items-start gap-6 lg:grid-cols-[1fr_18rem]">
		<div class="grid gap-6">
			<Card.Root class="gap-0 py-0">
				<Card.Header class="px-4 pt-4 pb-0">
					<Card.Title>Item pesanan</Card.Title>
				</Card.Header>
				<ul class="divide-y">
					{#each data.order.items as item (item.id)}
						<li class="flex gap-4 p-4">
							<div
								class="size-16 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-muted to-muted/40"
							>
								{#if item.productImage}
									<img
										src={item.productImage}
										alt={item.productName}
										loading="lazy"
										decoding="async"
										class="size-full object-cover"
									/>
								{/if}
							</div>
							<div class="min-w-0 flex-1">
								<p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
									{item.brand}
								</p>
								{#if item.productSlug}
									<a
										href={resolve('/produk/[slug]', { slug: item.productSlug })}
										class="line-clamp-2 text-sm leading-snug font-medium hover:underline"
									>
										{item.productName}
									</a>
								{:else}
									<p class="line-clamp-2 text-sm leading-snug font-medium">{item.productName}</p>
								{/if}
								<p class="mt-1 text-sm text-muted-foreground">
									{item.qty} × {formatRupiah(item.price)}
								</p>
							</div>
							<p class="shrink-0 text-sm font-semibold tabular-nums">
								{formatRupiah(item.lineTotal)}
							</p>
						</li>
					{/each}
				</ul>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title>Alamat pengiriman</Card.Title>
				</Card.Header>
				<Card.Content class="space-y-1 text-sm">
					<p class="font-medium">{data.order.recipientName}</p>
					<p class="text-muted-foreground">{data.order.phone}</p>
					<p class="text-muted-foreground">
						{data.order.addressLine}<br />
						{data.order.city}, {data.order.province} {data.order.postalCode}
					</p>
				</Card.Content>
			</Card.Root>
		</div>

		<Card.Root class="lg:sticky lg:top-20">
			<Card.Header>
				<Card.Title>Ringkasan</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-3 text-sm">
				<div class="flex justify-between">
					<span class="text-muted-foreground">Subtotal</span>
					<span class="tabular-nums">{formatRupiah(data.order.subtotal)}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-muted-foreground">Ongkos kirim</span>
					{#if data.order.shippingFee === 0}
						<span class="font-medium text-emerald-600 dark:text-emerald-500">Gratis</span>
					{:else}
						<span class="tabular-nums">{formatRupiah(data.order.shippingFee)}</span>
					{/if}
				</div>
				<Separator />
				<div class="flex items-baseline justify-between">
					<span class="font-medium">Total</span>
					<span class="text-lg font-bold tabular-nums">{formatRupiah(data.order.total)}</span>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</main>
