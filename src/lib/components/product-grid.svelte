<script lang="ts">
	import type { Snippet } from 'svelte';
	import ProductCard from '#lib/components/product-card.svelte';
	import { addToCart } from '#lib/cart-actions.js';
	import { cn } from '#lib/utils.js';
	import type { Product } from '#lib/types.js';

	let {
		products,
		pending = false,
		class: className = 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
		empty
	}: {
		products: Product[];
		/** True saat navigasi filter/pencarian masih memuat data server. */
		pending?: boolean;
		class?: string;
		empty?: Snippet;
	} = $props();
</script>

{#if products.length === 0}
	<div class="rounded-xl border border-dashed px-4 py-16 text-center">
		{#if empty}
			{@render empty()}
		{:else}
			<p class="font-medium">Produk tidak ditemukan</p>
			<p class="text-sm text-muted-foreground">Coba kata kunci atau kategori lain.</p>
		{/if}
	</div>
{:else}
	<div class={cn('grid gap-4 transition-opacity', className, pending && 'opacity-60')}>
		{#each products as product (product.id)}
			<ProductCard {product} onAddToCart={addToCart} />
		{/each}
	</div>
{/if}
