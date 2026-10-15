<script lang="ts" module>
	import RiMacbookLine from 'remixicon-svelte/icons/macbook-line';
	import RiComputerLine from 'remixicon-svelte/icons/computer-line';
	import RiCpuLine from 'remixicon-svelte/icons/cpu-line';
	import RiTv2Line from 'remixicon-svelte/icons/tv-2-line';
	import RiKeyboardLine from 'remixicon-svelte/icons/keyboard-line';
	import RiRouterLine from 'remixicon-svelte/icons/router-line';

	const categoryIcons = {
		laptop: RiMacbookLine,
		'pc-rakitan': RiComputerLine,
		komponen: RiCpuLine,
		monitor: RiTv2Line,
		aksesoris: RiKeyboardLine,
		jaringan: RiRouterLine
	} as const;
</script>

<script lang="ts">
	import RiStarFill from 'remixicon-svelte/icons/star-fill';
	import RiShoppingCart2Line from 'remixicon-svelte/icons/shopping-cart-2-line';
	import * as Card from '#lib/components/ui/card/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { discountPercent, formatCompact, formatRupiah } from '#lib/format.js';
	import type { Product } from '#lib/types.js';

	let { product, onAddToCart }: { product: Product; onAddToCart?: (product: Product) => void } =
		$props();

	const Icon = $derived(
		categoryIcons[product.category as keyof typeof categoryIcons] ?? RiComputerLine
	);
	const discount = $derived(discountPercent(product.price, product.originalPrice));
	const outOfStock = $derived(product.stock === 0);
</script>

<Card.Root class="group flex flex-col gap-0 overflow-hidden pt-0 transition-shadow hover:shadow-lg">
	<div
		class="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-muted to-muted/40"
	>
		<Icon
			class="size-16 text-muted-foreground/70 transition-transform duration-300 group-hover:scale-110"
		/>
		{#if discount > 0}
			<Badge class="absolute top-3 left-3">-{discount}%</Badge>
		{/if}
		{#if outOfStock}
			<Badge variant="secondary" class="absolute top-3 right-3">Stok Habis</Badge>
		{:else if product.stock <= 5}
			<Badge variant="outline" class="absolute top-3 right-3 bg-background">
				Sisa {product.stock}
			</Badge>
		{/if}
	</div>

	<Card.Header class="gap-1 pt-4">
		<span class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
			{product.brand}
		</span>
		<Card.Title class="line-clamp-2 min-h-10 leading-snug">{product.name}</Card.Title>
	</Card.Header>

	<Card.Content class="flex flex-1 flex-col gap-3">
		<ul class="flex flex-wrap gap-1">
			{#each product.specs.slice(0, 3) as spec (spec)}
				<li class="rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
					{spec}
				</li>
			{/each}
		</ul>

		<div class="mt-auto">
			{#if product.originalPrice && discount > 0}
				<p class="text-xs text-muted-foreground line-through">
					{formatRupiah(product.originalPrice)}
				</p>
			{/if}
			<p class="text-lg font-bold">{formatRupiah(product.price)}</p>
			<p class="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
				<RiStarFill class="size-3.5 text-amber-500" />
				{product.rating.toFixed(1)}
				<span aria-hidden="true">·</span>
				{formatCompact(product.sold)} terjual
			</p>
		</div>
	</Card.Content>

	<Card.Footer class="pt-4">
		<Button class="w-full" disabled={outOfStock} onclick={() => onAddToCart?.(product)}>
			<RiShoppingCart2Line />
			{outOfStock ? 'Stok Habis' : 'Tambah ke Keranjang'}
		</Button>
	</Card.Footer>
</Card.Root>
