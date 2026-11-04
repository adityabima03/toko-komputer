<script lang="ts">
	import { untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { navigating } from '$app/state';
	import RiArrowRightLine from 'remixicon-svelte/icons/arrow-right-line';
	import RiTruckLine from 'remixicon-svelte/icons/truck-line';
	import RiShieldCheckLine from 'remixicon-svelte/icons/shield-check-line';
	import RiCustomerService2Line from 'remixicon-svelte/icons/customer-service-2-line';
	import RiGamepadLine from 'remixicon-svelte/icons/gamepad-line';
	import SiteHeader from '#lib/components/site-header.svelte';
	import ProductGrid from '#lib/components/product-grid.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import { groupCategories } from '#lib/categories.js';
	import { toSearchParams } from '#lib/product-filter.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let search = $state(untrack(() => data.filter.q));

	$effect(() => {
		const value = search.trim();
		const timer = setTimeout(() => {
			if (value === data.filter.q) return;
			const qs = toSearchParams({ ...data.filter, q: value }).toString();
			goto(qs ? resolve(`/?${qs}`) : resolve('/'), { replace: true, reset: false });
		}, 300);
		return () => clearTimeout(timer);
	});

	$effect(() => {
		const q = data.filter.q;
		untrack(() => {
			if (search.trim() !== q) search = q;
		});
	});

	const categoryGroups = $derived(groupCategories(data.categories));
	const pending = $derived(!!navigating);

	const features = [
		{ icon: RiTruckLine, title: 'Gratis Ongkir', desc: 'Min. belanja Rp1 juta se-Indonesia' },
		{ icon: RiShieldCheckLine, title: 'Garansi Resmi', desc: '100% produk original bergaransi' },
		{ icon: RiCustomerService2Line, title: 'Konsultasi Rakit PC', desc: 'Tim teknisi siap 24/7' }
	];

	function setCategory(category: string) {
		const qs = toSearchParams({ ...data.filter, category }).toString();
		goto(qs ? resolve(`/?${qs}`) : resolve('/'), { replace: true, reset: false });
	}

	function scrollToProducts() {
		document.getElementById('produk')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<SiteHeader user={data.user} bind:search />

<main>
	<section class="border-b bg-gradient-to-b from-primary/10 to-background">
		<div class="container mx-auto grid items-center gap-8 px-4 py-14 md:grid-cols-2 md:py-20">
			<div class="space-y-5">
				<span
					class="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium"
				>
					<RiGamepadLine class="size-3.5 text-primary" /> Promo Gaming Week — diskon s/d 15%
				</span>
				<h1 class="text-4xl font-bold tracking-tight text-balance md:text-5xl">
					{#if data.user}
						Halo, {data.user.name.split(' ')[0]}! Siap upgrade setup-mu?
					{:else}
						Semua kebutuhan komputer, dalam satu toko.
					{/if}
				</h1>
				<p class="max-w-prose text-muted-foreground">
					Laptop, komponen seperti CPU dan GPU, sampai peripheral seperti mouse, keyboard, dan
					headset. Harga bersaing, garansi resmi, dan pengiriman cepat ke seluruh Indonesia.
				</p>
				<div class="flex flex-wrap gap-2">
					<Button size="lg" onclick={scrollToProducts}>
						Belanja Sekarang <RiArrowRightLine data-icon="inline-end" />
					</Button>
					{#if !data.user}
						<Button size="lg" variant="outline" href={resolve('/login')}>Masuk ke Akun</Button>
					{/if}
				</div>
			</div>

			<ul class="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
				{#each features as feature (feature.title)}
					<li class="flex items-center gap-3 rounded-xl border bg-card p-4">
						<span
							class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary"
						>
							<feature.icon class="size-5" />
						</span>
						<div>
							<p class="font-medium">{feature.title}</p>
							<p class="text-sm text-muted-foreground">{feature.desc}</p>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<section id="produk" class="container mx-auto scroll-mt-20 space-y-6 px-4 py-12">
		<div class="space-y-4">
			<div>
				<h2 class="text-2xl font-bold tracking-tight">Produk Pilihan</h2>
				<p class="text-sm text-muted-foreground">
					{#if data.filter.q}
						Hasil pencarian untuk "{data.filter.q}"
					{:else}
						Produk terlaris minggu ini
					{/if}
					<span aria-hidden="true">·</span>
					<a
						href={resolve('/produk')}
						class="font-medium text-primary underline-offset-4 hover:underline"
					>
						Lihat semua & filter
					</a>
				</p>
			</div>

			<div class="grid gap-2" role="tablist" aria-label="Kategori">
				<div>
					<Button
						size="sm"
						variant={data.filter.category === 'all' ? 'default' : 'outline'}
						role="tab"
						aria-selected={data.filter.category === 'all'}
						onclick={() => setCategory('all')}
					>
						Semua
					</Button>
				</div>
				{#each categoryGroups as group (group.name)}
					<div class="flex flex-col gap-1.5 sm:flex-row sm:items-center">
						<span
							class="w-28 shrink-0 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
						>
							{group.name}
						</span>
						<div class="flex flex-wrap gap-2">
							{#each group.categories as cat (cat.slug)}
								<Button
									size="sm"
									variant={data.filter.category === cat.slug ? 'default' : 'outline'}
									role="tab"
									aria-selected={data.filter.category === cat.slug}
									onclick={() => setCategory(cat.slug)}
								>
									{cat.name}
								</Button>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<ProductGrid products={data.products} {pending} />
	</section>
</main>

<footer class="border-t">
	<div
		class="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground md:flex-row"
	>
		<p>© {new Date().getFullYear()} TokoKomputer. Semua hak dilindungi.</p>
		<p>Dibangun dengan SvelteKit & shadcn-svelte</p>
	</div>
</footer>
