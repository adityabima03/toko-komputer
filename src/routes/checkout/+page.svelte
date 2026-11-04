<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { untrack } from 'svelte';
	import RiArrowLeftLine from 'remixicon-svelte/icons/arrow-left-line';
	import RiLoader4Line from 'remixicon-svelte/icons/loader-4-line';
	import RiMapPinLine from 'remixicon-svelte/icons/map-pin-line';
	import RiSecurePaymentLine from 'remixicon-svelte/icons/secure-payment-line';
	import SiteHeader from '#lib/components/site-header.svelte';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Form from '#lib/components/ui/form/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Separator } from '#lib/components/ui/separator/index.js';
	import { categoryIcon } from '#lib/category-icons.js';
	import { formatRupiah } from '#lib/format.js';
	import { checkoutSchema } from '#lib/schemas/checkout.js';
	import { calcShippingFee, FREE_SHIPPING_MIN } from '#lib/shipping.js';
	import { cart } from '#lib/stores/cart.svelte.js';
	import { cn } from '#lib/utils.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	/** Cegah redirect ke /keranjang saat keranjang dikosongkan setelah buat pesanan. */
	let placingOrder = $state(false);

	$effect(() => {
		const products = data.products;
		if (untrack(() => cart.sync(products))) {
			toast.info('Keranjang diperbarui', {
				description: 'Harga atau stok beberapa produk telah berubah.'
			});
		}
	});

	// svelte-ignore state_referenced_locally
	const checkout = superForm(data.form, {
		validators: zod4Client(checkoutSchema),
		onResult: ({ result }) => {
			if (result.type === 'redirect') {
				placingOrder = true;
				cart.clear();
			}
		},
		onUpdated: ({ form }) => {
			if (!form.valid && typeof form.message === 'string') toast.error(form.message);
		}
	});
	const { form: formData, enhance, submitting, message } = checkout;

	$effect(() => {
		if (placingOrder || $submitting) return;
		if (cart.available.length === 0) {
			goto(resolve('/keranjang'));
		}
	});

	$effect(() => {
		$formData.itemsJson = JSON.stringify(
			cart.available.map((item) => ({
				productId: item.product.id,
				qty: item.qty
			}))
		);
	});

	const shippingFee = $derived(calcShippingFee(cart.total));
	const grandTotal = $derived(cart.total + shippingFee);
	const selectedAddress = $derived(
		data.addresses.find((a) => a.id === $formData.addressId) ?? data.addresses[0]
	);

	$effect(() => {
		if (!data.addresses.some((a) => a.id === $formData.addressId) && data.addresses[0]) {
			$formData.addressId = data.addresses[0].id;
		}
	});
</script>

<svelte:head>
	<title>Checkout — TokoKomputer</title>
</svelte:head>

<SiteHeader user={data.user} showSearch={false} />

<main class="container mx-auto max-w-5xl px-4 py-8 md:py-12">
	<Button variant="ghost" size="sm" href={resolve('/keranjang')} class="mb-3 -ml-2.5">
		<RiArrowLeftLine data-icon="inline-start" /> Kembali ke keranjang
	</Button>

	<h1 class="mb-6 text-2xl font-bold tracking-tight">Checkout</h1>

	{#if data.addresses.length === 0}
		<Card.Root>
			<Card.Content class="flex flex-col items-center gap-3 py-12 text-center">
				<span
					class="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary"
				>
					<RiMapPinLine class="size-6" />
				</span>
				<div>
					<p class="font-medium">Belum ada alamat pengiriman</p>
					<p class="text-sm text-muted-foreground">
						Tambah alamat dulu sebelum membuat pesanan.
					</p>
				</div>
				<Button href="{resolve('/profil')}#alamat">Tambah Alamat</Button>
			</Card.Content>
		</Card.Root>
	{:else if cart.available.length > 0}
		<form method="POST" class="grid items-start gap-6 lg:grid-cols-[1fr_22rem]" use:enhance>
			<input type="hidden" name="itemsJson" value={$formData.itemsJson} />

			<div class="grid gap-6">
				<Card.Root>
					<Card.Header>
						<Card.Title>Alamat Pengiriman</Card.Title>
						<Card.Description>Pilih alamat tujuan pengiriman pesananmu.</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-3">
						<Form.Field form={checkout} name="addressId">
							<div class="grid gap-3" role="radiogroup" aria-label="Alamat pengiriman">
								{#each data.addresses as address (address.id)}
									<label
										class={cn(
											'flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors',
											$formData.addressId === address.id
												? 'border-primary bg-primary/5'
												: 'hover:bg-muted/40'
										)}
									>
										<input
											type="radio"
											name="addressId"
											value={address.id}
											class="mt-1"
											bind:group={$formData.addressId}
										/>
										<div class="min-w-0 space-y-1">
											<div class="flex flex-wrap items-center gap-2">
												<p class="font-medium">{address.label}</p>
												{#if address.isDefault}
													<Badge variant="secondary">Utama</Badge>
												{/if}
											</div>
											<p class="text-sm">
												{address.recipientName} · {address.phone}
											</p>
											<p class="text-sm text-muted-foreground">
												{address.addressLine}, {address.city}, {address.province}
												{address.postalCode}
											</p>
										</div>
									</label>
								{/each}
							</div>
							<Form.FieldErrors />
						</Form.Field>

						<Button href="{resolve('/profil')}#alamat" variant="outline" size="sm">
							Kelola alamat
						</Button>
					</Card.Content>
				</Card.Root>

				<Card.Root class="gap-0 py-0">
					<Card.Header class="px-4 pt-4 pb-0">
						<Card.Title>Pesanan</Card.Title>
					</Card.Header>
					<ul class="divide-y">
						{#each cart.available as item (item.product.id)}
							{@const Icon = categoryIcon(item.product.category)}
							<li class="flex gap-4 p-4">
								<div
									class="size-16 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-muted to-muted/40"
								>
									{#if item.product.image}
										<img
											src={item.product.image}
											alt={item.product.name}
											loading="lazy"
											decoding="async"
											class="size-full object-cover"
										/>
									{:else}
										<div class="flex size-full items-center justify-center">
											<Icon class="size-7 text-muted-foreground/70" />
										</div>
									{/if}
								</div>
								<div class="min-w-0 flex-1">
									<p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
										{item.product.brand}
									</p>
									<p class="line-clamp-2 text-sm leading-snug font-medium">{item.product.name}</p>
									<p class="mt-1 text-sm text-muted-foreground">
										{item.qty} × {formatRupiah(item.product.price)}
									</p>
								</div>
								<p class="shrink-0 text-sm font-semibold tabular-nums">
									{formatRupiah(item.product.price * item.qty)}
								</p>
							</li>
						{/each}
					</ul>
				</Card.Root>
			</div>

			<Card.Root class="lg:sticky lg:top-20">
				<Card.Header>
					<Card.Title>Ringkasan</Card.Title>
					{#if selectedAddress}
						<Card.Description>
							Dikirim ke {selectedAddress.city}, {selectedAddress.province}
						</Card.Description>
					{/if}
				</Card.Header>
				<Card.Content class="space-y-3 text-sm">
					{#if $message}
						<p class="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
							{$message}
						</p>
					{/if}

					<div class="flex justify-between">
						<span class="text-muted-foreground">
							Subtotal ({cart.available.reduce((n, i) => n + i.qty, 0)} item)
						</span>
						<span class="tabular-nums">{formatRupiah(cart.total)}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-muted-foreground">Ongkos kirim</span>
						{#if shippingFee === 0}
							<span class="font-medium text-emerald-600 dark:text-emerald-500">Gratis</span>
						{:else}
							<span class="tabular-nums">{formatRupiah(shippingFee)}</span>
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
						<span class="text-lg font-bold tabular-nums">{formatRupiah(grandTotal)}</span>
					</div>

					<p class="text-xs text-muted-foreground">
						Setelah pesanan dibuat, transfer ke rekening toko lalu unggah bukti pembayaran.
					</p>
				</Card.Content>
				<Card.Footer>
					<Button type="submit" size="lg" class="w-full" disabled={$submitting}>
						{#if $submitting}
							<RiLoader4Line class="animate-spin" /> Memproses...
						{:else}
							<RiSecurePaymentLine data-icon="inline-start" /> Buat Pesanan
						{/if}
					</Button>
				</Card.Footer>
			</Card.Root>
		</form>
	{/if}
</main>
