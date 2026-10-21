<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { resolve } from '$app/paths';
	import RiArrowLeftLine from 'remixicon-svelte/icons/arrow-left-line';
	import RiErrorWarningLine from 'remixicon-svelte/icons/error-warning-line';
	import RiShoppingCart2Line from 'remixicon-svelte/icons/shopping-cart-2-line';
	import RiStarFill from 'remixicon-svelte/icons/star-fill';
	import SiteHeader from '#lib/components/site-header.svelte';
	import * as Alert from '#lib/components/ui/alert/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Separator } from '#lib/components/ui/separator/index.js';
	import { Skeleton } from '#lib/components/ui/skeleton/index.js';
	import { getErrorMessage } from '#lib/api/client.js';
	import { categoriesQuery, productQuery } from '#lib/api/products.js';
	import { addToCart } from '#lib/cart-actions.js';
	import { categoryIcon } from '#lib/category-icons.js';
	import { discountPercent, formatCompact, formatRupiah } from '#lib/format.js';
	import { cart } from '#lib/stores/cart.svelte.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const product = createQuery(() => productQuery(data.slug));
	const categories = createQuery(() => categoriesQuery());

	const p = $derived(product.data);
	const Icon = $derived(p ? categoryIcon(p.category) : null);
	const discount = $derived(p ? discountPercent(p.price, p.originalPrice) : 0);
	const outOfStock = $derived(p?.stock === 0);
	const categoryName = $derived(
		categories.data?.find((c) => c.slug === p?.category)?.name ?? p?.category
	);
	const inCart = $derived(p ? cart.qtyOf(p.id) : 0);
	let imageFailed = $state(false);
</script>

<svelte:head>
	<title>{p ? `${p.name} — TokoKomputer` : 'Detail Produk — TokoKomputer'}</title>
</svelte:head>

<SiteHeader user={data.user} showSearch={false} />

<main class="container mx-auto px-4 py-8 md:py-12">
	<Button variant="ghost" size="sm" href={resolve('/produk')} class="mb-4 -ml-2.5">
		<RiArrowLeftLine data-icon="inline-start" /> Kembali ke katalog
	</Button>

	{#if product.isError}
		<Alert.Root variant="destructive" class="max-w-lg">
			<RiErrorWarningLine />
			<Alert.Title>Produk tidak ditemukan</Alert.Title>
			<Alert.Description>{getErrorMessage(product.error)}</Alert.Description>
		</Alert.Root>
		<Button href={resolve('/produk')} class="mt-4">Lihat katalog</Button>
	{:else if product.isPending || !p || !Icon}
		<div class="grid gap-8 lg:grid-cols-2 lg:gap-12">
			<Skeleton class="aspect-square w-full rounded-xl" />
			<div class="space-y-4">
				<Skeleton class="h-4 w-24" />
				<Skeleton class="h-8 w-3/4" />
				<Skeleton class="h-6 w-40" />
				<Skeleton class="h-10 w-48" />
				<Skeleton class="h-11 w-full max-w-xs" />
			</div>
		</div>
	{:else}
		<div class="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
			<div
				class="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border bg-gradient-to-br from-muted to-muted/40"
			>
				{#if imageFailed}
					<Icon class="size-28 text-muted-foreground/70" />
				{:else}
					<img
						src={p.image}
						alt={p.name}
						class="size-full object-cover"
						onload={() => (imageFailed = false)}
						onerror={() => (imageFailed = true)}
					/>
				{/if}
				{#if discount > 0}
					<Badge class="absolute top-4 left-4">-{discount}%</Badge>
				{/if}
			</div>

			<div class="flex flex-col gap-5">
				<div>
					<p class="text-sm font-medium tracking-wide text-muted-foreground uppercase">
						{p.brand}
						<span aria-hidden="true"> · </span>
						<a
							href={resolve(`/produk?category=${p.category}`)}
							class="hover:text-foreground hover:underline"
						>
							{categoryName}
						</a>
					</p>
					<h1 class="mt-1 text-2xl font-bold tracking-tight md:text-3xl">{p.name}</h1>
					<p class="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
						<span class="inline-flex items-center gap-1">
							<RiStarFill class="size-4 text-amber-500" />
							{p.rating.toFixed(1)}
						</span>
						<span aria-hidden="true">·</span>
						<span>{formatCompact(p.sold)} terjual</span>
						<span aria-hidden="true">·</span>
						{#if outOfStock}
							<Badge variant="secondary">Stok Habis</Badge>
						{:else if p.stock <= 5}
							<Badge variant="outline">Sisa {p.stock}</Badge>
						{:else}
							<span>Stok {p.stock}</span>
						{/if}
					</p>
				</div>

				<div>
					{#if p.originalPrice && discount > 0}
						<p class="text-sm text-muted-foreground line-through">
							{formatRupiah(p.originalPrice)}
						</p>
					{/if}
					<p class="text-3xl font-bold tracking-tight">{formatRupiah(p.price)}</p>
					{#if discount > 0 && p.originalPrice}
						<p class="mt-1 text-sm text-emerald-600 dark:text-emerald-400">
							Hemat {formatRupiah(p.originalPrice - p.price)}
						</p>
					{/if}
				</div>

				<div class="flex flex-col gap-2 sm:flex-row sm:items-center">
					<Button size="lg" class="sm:min-w-56" disabled={outOfStock} onclick={() => addToCart(p)}>
						<RiShoppingCart2Line data-icon="inline-start" />
						{outOfStock ? 'Stok Habis' : 'Tambah ke Keranjang'}
					</Button>
					{#if inCart > 0}
						<Button variant="outline" size="lg" href={resolve('/keranjang')}>
							Di keranjang ({inCart})
						</Button>
					{/if}
				</div>

				<Separator />

				<section>
					<h2 class="text-sm font-semibold tracking-wide uppercase">Spesifikasi</h2>
					{#if p.specs.length === 0}
						<p class="mt-2 text-sm text-muted-foreground">Belum ada spesifikasi.</p>
					{:else}
						<ul class="mt-3 grid gap-2 sm:grid-cols-2">
							{#each p.specs as spec (spec)}
								<li class="rounded-lg bg-muted/70 px-3 py-2 text-sm">{spec}</li>
							{/each}
						</ul>
					{/if}
				</section>
			</div>
		</div>
	{/if}
</main>
