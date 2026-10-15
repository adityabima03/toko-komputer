<script lang="ts">
	import RiLayoutGridLine from 'remixicon-svelte/icons/layout-grid-line';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Checkbox } from '#lib/components/ui/checkbox/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import { Separator } from '#lib/components/ui/separator/index.js';
	import { categoryIcon } from '#lib/category-icons.js';
	import { activeFilterCount, PRICE_PRESETS } from '#lib/product-filter.js';
	import { cn } from '#lib/utils.js';
	import type { BrandCount, Category, ProductFilter } from '#lib/types.js';

	let {
		filter,
		categories,
		brands,
		onChange,
		onReset,
		idPrefix = 'filter'
	}: {
		filter: ProductFilter;
		categories: Category[];
		brands: BrandCount[];
		onChange: (patch: Partial<ProductFilter>) => void;
		onReset: () => void;
		/** Komponen ini bisa tampil dua kali (sidebar & sheet), jadi id input harus unik. */
		idPrefix?: string;
	} = $props();

	let minInput = $state('');
	let maxInput = $state('');

	$effect(() => {
		minInput = filter.minPrice?.toString() ?? '';
		maxInput = filter.maxPrice?.toString() ?? '';
	});

	const toId = (name: string) => `${idPrefix}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

	function parsePrice(value: string) {
		const digits = value.replace(/\D/g, '');
		return digits ? Number(digits) : undefined;
	}

	function applyPrice(event: SubmitEvent) {
		event.preventDefault();
		let min = parsePrice(minInput);
		let max = parsePrice(maxInput);
		if (min != null && max != null && min > max) [min, max] = [max, min];
		onChange({ minPrice: min, maxPrice: max });
	}

	function toggleBrand(name: string, checked: boolean) {
		onChange({
			brands: checked ? [...filter.brands, name] : filter.brands.filter((b) => b !== name)
		});
	}

	const isPresetActive = (p: (typeof PRICE_PRESETS)[number]) =>
		p.min === filter.minPrice && p.max === filter.maxPrice;
</script>

<div class="grid gap-5 text-sm">
	<section class="grid gap-2">
		<h3 class="font-semibold">Kategori</h3>
		<ul class="grid gap-0.5">
			{#each [{ slug: 'all', name: 'Semua kategori' }, ...categories] as cat (cat.slug)}
				{@const Icon = cat.slug === 'all' ? RiLayoutGridLine : categoryIcon(cat.slug)}
				{@const active = filter.category === cat.slug}
				<li>
					<button
						type="button"
						class={cn(
							'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted',
							active && 'bg-primary/10 font-medium text-primary hover:bg-primary/15'
						)}
						aria-current={active ? 'true' : undefined}
						onclick={() => onChange({ category: cat.slug })}
					>
						<Icon class="size-4 shrink-0" />
						{cat.name}
					</button>
				</li>
			{/each}
		</ul>
	</section>

	<Separator />

	<section class="grid gap-2">
		<h3 class="font-semibold">Brand</h3>
		{#if brands.length === 0}
			<p class="text-xs text-muted-foreground">Belum ada brand di kategori ini.</p>
		{:else}
			<ul class="grid gap-2">
				{#each brands as brand (brand.name)}
					<li class="flex items-center gap-2">
						<Checkbox
							id={toId(brand.name)}
							checked={filter.brands.includes(brand.name)}
							onCheckedChange={(checked) => toggleBrand(brand.name, checked === true)}
						/>
						<Label for={toId(brand.name)} class="flex-1 font-normal">{brand.name}</Label>
						<span class="text-xs text-muted-foreground tabular-nums">{brand.count}</span>
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<Separator />

	<section class="grid gap-2">
		<h3 class="font-semibold">Harga</h3>
		<div class="flex flex-wrap gap-1.5">
			{#each PRICE_PRESETS as preset (preset.label)}
				<Button
					size="xs"
					variant={isPresetActive(preset) ? 'default' : 'outline'}
					onclick={() =>
						isPresetActive(preset)
							? onChange({ minPrice: undefined, maxPrice: undefined })
							: onChange({ minPrice: preset.min, maxPrice: preset.max })}
				>
					{preset.label}
				</Button>
			{/each}
		</div>
		<form class="flex items-center gap-1.5" onsubmit={applyPrice}>
			<Input
				inputmode="numeric"
				placeholder="Min"
				aria-label="Harga minimum"
				class="h-8"
				bind:value={minInput}
			/>
			<span class="text-muted-foreground">–</span>
			<Input
				inputmode="numeric"
				placeholder="Maks"
				aria-label="Harga maksimum"
				class="h-8"
				bind:value={maxInput}
			/>
			<Button type="submit" size="sm" variant="secondary">OK</Button>
		</form>
	</section>

	<Separator />

	<section class="flex items-center gap-2">
		<Checkbox
			id={toId('stock')}
			checked={filter.inStock}
			onCheckedChange={(checked) => onChange({ inStock: checked === true })}
		/>
		<Label for={toId('stock')} class="font-normal">Hanya yang ada stok</Label>
	</section>

	<Button
		variant="ghost"
		size="sm"
		class="justify-self-start"
		disabled={activeFilterCount(filter) === 0}
		onclick={onReset}
	>
		Reset filter
	</Button>
</div>
