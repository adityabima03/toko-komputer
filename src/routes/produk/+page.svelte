<script lang="ts">
	import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
	import { untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import RiCloseLine from 'remixicon-svelte/icons/close-line';
	import RiFilter3Line from 'remixicon-svelte/icons/filter-3-line';
	import SiteHeader from '#lib/components/site-header.svelte';
	import ProductFilters from '#lib/components/product-filters.svelte';
	import ProductGrid from '#lib/components/product-grid.svelte';
	import * as Select from '#lib/components/ui/select/index.js';
	import * as Sheet from '#lib/components/ui/sheet/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { brandsQuery, categoriesQuery, productsQuery } from '#lib/api/products.js';
	import { formatRupiah } from '#lib/format.js';
	import {
		activeFilterCount,
		DEFAULT_PRODUCT_FILTER,
		parseProductFilter,
		SORT_OPTIONS,
		toSearchParams
	} from '#lib/product-filter.js';
	import type { ProductFilter, ProductSort } from '#lib/types.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const filter = $derived(parseProductFilter(page.url.searchParams));
	const filterCount = $derived(activeFilterCount(filter));

	const categories = createQuery(() => categoriesQuery());
	const brands = createQuery(() => ({
		...brandsQuery(filter.category),
		placeholderData: keepPreviousData
	}));
	const products = createQuery(() => ({
		...productsQuery(filter),
		placeholderData: keepPreviousData
	}));

	const categoryName = $derived(
		categories.data?.find((c) => c.slug === filter.category)?.name ?? 'Semua Produk'
	);
	const sortLabel = $derived(SORT_OPTIONS.find((o) => o.value === filter.sort)?.label);

	function updateFilter(patch: Partial<ProductFilter>) {
		const next = { ...filter, ...patch };
		// Brand yang dipilih belum tentu ada di kategori baru.
		if (patch.category !== undefined && patch.category !== filter.category) next.brands = [];
		const qs = toSearchParams(next).toString();
		goto(qs ? resolve(`/produk?${qs}`) : resolve('/produk'), { replace: true, reset: false });
	}

	function resetFilter() {
		updateFilter({ ...DEFAULT_PRODUCT_FILTER, q: filter.q, sort: filter.sort });
	}

	let search = $state(untrack(() => filter.q));

	$effect(() => {
		const value = search.trim();
		const timer = setTimeout(() => {
			if (value !== filter.q) updateFilter({ q: value });
		}, 300);
		return () => clearTimeout(timer);
	});

	// Sinkronkan kolom cari saat URL berubah dari luar (mis. tombol Back).
	$effect(() => {
		const q = filter.q;
		untrack(() => {
			if (search.trim() !== q) search = q;
		});
	});

	let filterSheetOpen = $state(false);

	type Chip = { label: string; remove: () => void };
	const chips = $derived.by(() => {
		const list: Chip[] = [];
		if (filter.category !== 'all') {
			list.push({ label: categoryName, remove: () => updateFilter({ category: 'all' }) });
		}
		for (const brand of filter.brands) {
			list.push({
				label: brand,
				remove: () => updateFilter({ brands: filter.brands.filter((b) => b !== brand) })
			});
		}
		if (filter.minPrice != null || filter.maxPrice != null) {
			const min = filter.minPrice != null ? formatRupiah(filter.minPrice) : 'Rp0';
			const max = filter.maxPrice != null ? formatRupiah(filter.maxPrice) : '∞';
			list.push({
				label: `${min} – ${max}`,
				remove: () => updateFilter({ minPrice: undefined, maxPrice: undefined })
			});
		}
		if (filter.inStock) {
			list.push({ label: 'Ada stok', remove: () => updateFilter({ inStock: false }) });
		}
		return list;
	});
</script>

<svelte:head>
	<title>{categoryName} — TokoKomputer</title>
</svelte:head>

{#snippet filters(idPrefix: string)}
	<ProductFilters
		{filter}
		{idPrefix}
		categories={categories.data ?? []}
		brands={brands.data ?? []}
		onChange={updateFilter}
		onReset={resetFilter}
	/>
{/snippet}

<SiteHeader user={data.user} bind:search />

<main class="container mx-auto px-4 py-8">
	<div class="mb-4 flex flex-wrap items-end justify-between gap-3">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">{categoryName}</h1>
			<p class="text-sm text-muted-foreground">
				{#if products.data}
					{products.data.length} produk{#if filter.q}
						untuk "{filter.q}"{/if}
				{:else}
					Memuat produk...
				{/if}
			</p>
		</div>

		<div class="flex items-center gap-2">
			<Sheet.Root bind:open={filterSheetOpen}>
				<Sheet.Trigger class="lg:hidden">
					{#snippet child({ props })}
						<Button {...props} variant="outline" size="sm">
							<RiFilter3Line data-icon="inline-start" /> Filter
							{#if filterCount > 0}
								<Badge class="ml-0.5">{filterCount}</Badge>
							{/if}
						</Button>
					{/snippet}
				</Sheet.Trigger>
				<Sheet.Content side="left" class="overflow-y-auto">
					<Sheet.Header>
						<Sheet.Title>Filter Produk</Sheet.Title>
					</Sheet.Header>
					<div class="px-4">{@render filters('sheet')}</div>
					<Sheet.Footer class="sticky bottom-0 border-t bg-popover">
						<Button onclick={() => (filterSheetOpen = false)}>
							Tampilkan {products.data?.length ?? 0} produk
						</Button>
					</Sheet.Footer>
				</Sheet.Content>
			</Sheet.Root>

			<Select.Root
				type="single"
				value={filter.sort}
				onValueChange={(value) => updateFilter({ sort: value as ProductSort })}
			>
				<Select.Trigger size="sm" class="w-44" aria-label="Urutkan produk">
					{sortLabel}
				</Select.Trigger>
				<Select.Content align="end">
					{#each SORT_OPTIONS as option (option.value)}
						<Select.Item value={option.value} label={option.label}>{option.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	{#if chips.length > 0}
		<div class="mb-6 flex flex-wrap items-center gap-1.5">
			{#each chips as chip (chip.label)}
				<Badge variant="secondary" class="gap-1 pr-1">
					{chip.label}
					<button
						type="button"
						class="rounded-full p-0.5 hover:bg-foreground/10"
						aria-label="Hapus filter {chip.label}"
						onclick={chip.remove}
					>
						<RiCloseLine class="size-3" />
					</button>
				</Badge>
			{/each}
			<Button variant="link" size="xs" onclick={resetFilter}>Hapus semua</Button>
		</div>
	{/if}

	<div class="grid items-start gap-8 lg:grid-cols-[15rem_1fr]">
		<aside class="hidden lg:sticky lg:top-20 lg:block" aria-label="Filter produk">
			{@render filters('sidebar')}
		</aside>

		<section aria-label="Daftar produk">
			<ProductGrid query={products} class="sm:grid-cols-2 xl:grid-cols-3">
				{#snippet empty()}
					<p class="font-medium">Tidak ada produk yang cocok</p>
					<p class="text-sm text-muted-foreground">Coba kurangi filter atau ubah kata kunci.</p>
					{#if filterCount > 0}
						<Button variant="outline" size="sm" class="mt-4" onclick={resetFilter}>
							Reset filter
						</Button>
					{/if}
				{/snippet}
			</ProductGrid>
		</section>
	</div>
</main>
