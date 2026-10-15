<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { untrack } from 'svelte';
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';
	import RiAddLine from 'remixicon-svelte/icons/add-line';
	import RiArrowLeftLine from 'remixicon-svelte/icons/arrow-left-line';
	import RiDeleteBinLine from 'remixicon-svelte/icons/delete-bin-line';
	import RiSecurePaymentLine from 'remixicon-svelte/icons/secure-payment-line';
	import RiShoppingBag3Line from 'remixicon-svelte/icons/shopping-bag-3-line';
	import RiSubtractLine from 'remixicon-svelte/icons/subtract-line';
	import SiteHeader from '#lib/components/site-header.svelte';
	import * as Card from '#lib/components/ui/card/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Separator } from '#lib/components/ui/separator/index.js';
	import { DEFAULT_PRODUCT_FILTER, productsQuery } from '#lib/api/products.js';
	import { categoryIcon } from '#lib/category-icons.js';
	import { formatRupiah } from '#lib/format.js';
	import { cart, type CartItem } from '#lib/stores/cart.svelte.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const FREE_SHIPPING_MIN = 1_000_000;

	const latest = createQuery(() => productsQuery(DEFAULT_PRODUCT_FILTER));

	$effect(() => {
		const products = latest.data;
		if (products && untrack(() => cart.sync(products))) {
			toast.info('Keranjang diperbarui', {
				description: 'Harga atau stok beberapa produk telah berubah.'
			});
		}
	});

	const unavailableCount = $derived(cart.items.length - cart.available.length);

	function changeQty(item: CartItem, qty: number) {
		if (!cart.setQty(item.product, qty)) {
			toast.error('Stok tidak mencukupi', {
				description: `Maksimal ${item.product.stock} unit untuk ${item.product.name}`
			});
		}
	}

	function removeItem(item: CartItem) {
		const snapshot = $state.snapshot(cart.items);
		cart.remove(item.product.id);
		toast('Produk dihapus dari keranjang', {
			description: item.product.name,
			action: { label: 'Urungkan', onClick: () => cart.restore(snapshot) }
		});
	}

	function clearCart() {
		const snapshot = $state.snapshot(cart.items);
		cart.clear();
		toast('Keranjang dikosongkan', {
			action: { label: 'Urungkan', onClick: () => cart.restore(snapshot) }
		});
	}

	function checkout() {
		toast.info('Fitur checkout segera hadir');
	}
</script>

<svelte:head>
	<title>Keranjang — TokoKomputer</title>
</svelte:head>

<SiteHeader user={data.user} showSearch={false} />

<main class="container mx-auto px-4 py-8 md:py-12">
	<Button variant="ghost" size="sm" href={resolve('/')} class="mb-3 -ml-2.5">
		<RiArrowLeftLine data-icon="inline-start" /> Lanjut belanja
	</Button>

	<div class="mb-6 flex items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">Keranjang Belanja</h1>
			<p class="text-sm text-muted-foreground">
				{cart.count} item dari {cart.items.length} produk
			</p>
		</div>
		{#if cart.items.length > 0}
			<Button variant="ghost" size="sm" class="text-destructive" onclick={clearCart}>
				<RiDeleteBinLine data-icon="inline-start" /> Kosongkan
			</Button>
		{/if}
	</div>

	{#if cart.items.length === 0}
		<div
			class="flex flex-col items-center gap-3 rounded-xl border border-dashed px-4 py-20 text-center"
		>
			<span
				class="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary"
			>
				<RiShoppingBag3Line class="size-7" />
			</span>
			<div>
				<p class="font-medium">Keranjangmu masih kosong</p>
				<p class="text-sm text-muted-foreground">
					Yuk, cari laptop, komponen, atau aksesoris incaranmu.
				</p>
			</div>
			<Button href={resolve('/')} class="mt-2">Mulai Belanja</Button>
		</div>
	{:else}
		<div class="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
			<Card.Root class="gap-0 py-0">
				<ul class="divide-y">
					{#each cart.items as item (item.product.id)}
						{@const Icon = categoryIcon(item.product.category)}
						{@const outOfStock = item.product.stock === 0}
						<li class={['flex gap-4 p-4', outOfStock && 'opacity-60']}>
							<div
								class="flex size-20 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-muted to-muted/40"
							>
								<Icon class="size-9 text-muted-foreground/70" />
							</div>

							<div class="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:justify-between">
								<div class="min-w-0 space-y-1">
									<p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
										{item.product.brand}
									</p>
									<p class="line-clamp-2 leading-snug font-medium">{item.product.name}</p>
									<p class="flex items-baseline gap-2 text-sm">
										<span class="font-semibold">{formatRupiah(item.product.price)}</span>
										{#if item.product.originalPrice && item.product.originalPrice > item.product.price}
											<span class="text-xs text-muted-foreground line-through">
												{formatRupiah(item.product.originalPrice)}
											</span>
										{/if}
									</p>
									{#if outOfStock}
										<Badge variant="destructive">Stok habis</Badge>
									{:else if item.product.stock <= 5}
										<p class="text-xs text-amber-600 dark:text-amber-500">
											Sisa {item.product.stock} unit
										</p>
									{/if}
								</div>

								<div class="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
									<p class="font-semibold tabular-nums sm:order-last">
										{formatRupiah(item.product.price * item.qty)}
									</p>
									<div class="flex items-center gap-1">
										<div class="flex items-center rounded-lg border">
											<Button
												variant="ghost"
												size="icon-sm"
												aria-label="Kurangi jumlah"
												disabled={item.qty <= 1}
												onclick={() => changeQty(item, item.qty - 1)}
											>
												<RiSubtractLine />
											</Button>
											<span class="w-8 text-center text-sm font-medium tabular-nums">
												{item.qty}
											</span>
											<Button
												variant="ghost"
												size="icon-sm"
												aria-label="Tambah jumlah"
												disabled={item.qty >= item.product.stock}
												onclick={() => changeQty(item, item.qty + 1)}
											>
												<RiAddLine />
											</Button>
										</div>
										<Button
											variant="ghost"
											size="icon-sm"
											class="text-muted-foreground hover:text-destructive"
											aria-label="Hapus {item.product.name}"
											onclick={() => removeItem(item)}
										>
											<RiDeleteBinLine />
										</Button>
									</div>
								</div>
							</div>
						</li>
					{/each}
				</ul>
			</Card.Root>

			<Card.Root class="lg:sticky lg:top-20">
				<Card.Header>
					<Card.Title>Ringkasan Belanja</Card.Title>
				</Card.Header>
				<Card.Content class="space-y-3 text-sm">
					<div class="flex justify-between">
						<span class="text-muted-foreground">
							Subtotal ({cart.available.reduce((n, i) => n + i.qty, 0)} item)
						</span>
						<span class="tabular-nums">{formatRupiah(cart.total + cart.savings)}</span>
					</div>
					{#if cart.savings > 0}
						<div class="flex justify-between text-emerald-600 dark:text-emerald-500">
							<span>Hemat</span>
							<span class="tabular-nums">-{formatRupiah(cart.savings)}</span>
						</div>
					{/if}
					<div class="flex justify-between">
						<span class="text-muted-foreground">Ongkos kirim</span>
						{#if cart.total >= FREE_SHIPPING_MIN}
							<span class="font-medium text-emerald-600 dark:text-emerald-500">Gratis</span>
						{:else}
							<span class="text-muted-foreground">Dihitung saat checkout</span>
						{/if}
					</div>
					{#if cart.total > 0 && cart.total < FREE_SHIPPING_MIN}
						<p class="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
							Belanja {formatRupiah(FREE_SHIPPING_MIN - cart.total)} lagi untuk gratis ongkir.
						</p>
					{/if}

					<Separator />

					<div class="flex items-baseline justify-between">
						<span class="font-medium">Total</span>
						<span class="text-lg font-bold tabular-nums">{formatRupiah(cart.total)}</span>
					</div>

					{#if unavailableCount > 0}
						<p class="text-xs text-destructive">
							{unavailableCount} produk stoknya habis dan tidak ikut dihitung.
						</p>
					{/if}
				</Card.Content>
				<Card.Footer class="flex-col gap-2">
					<Button
						size="lg"
						class="w-full"
						disabled={cart.available.length === 0}
						onclick={checkout}
					>
						<RiSecurePaymentLine data-icon="inline-start" /> Checkout
					</Button>
					{#if !data.user}
						<p class="text-center text-xs text-muted-foreground">
							Kamu perlu <a href={resolve('/login')} class="text-primary underline">masuk</a> untuk checkout.
						</p>
					{/if}
				</Card.Footer>
			</Card.Root>
		</div>
	{/if}
</main>
