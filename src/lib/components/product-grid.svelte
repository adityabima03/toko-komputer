<script lang="ts">
	import type { CreateQueryResult } from '@tanstack/svelte-query';
	import type { Snippet } from 'svelte';
	import RiErrorWarningLine from 'remixicon-svelte/icons/error-warning-line';
	import ProductCard from '#lib/components/product-card.svelte';
	import * as Alert from '#lib/components/ui/alert/index.js';
	import { Skeleton } from '#lib/components/ui/skeleton/index.js';
	import { getErrorMessage } from '#lib/api/client.js';
	import { addToCart } from '#lib/cart-actions.js';
	import { cn } from '#lib/utils.js';
	import type { Product } from '#lib/types.js';

	let {
		query,
		class: className = 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
		empty
	}: {
		query: CreateQueryResult<Product[], Error>;
		/** Kelas kolom grid, karena lebar area produk berbeda di tiap halaman. */
		class?: string;
		empty?: Snippet;
	} = $props();
</script>

{#if query.isError}
	<Alert.Root variant="destructive">
		<RiErrorWarningLine />
		<Alert.Title>Gagal memuat produk</Alert.Title>
		<Alert.Description>{getErrorMessage(query.error)}</Alert.Description>
	</Alert.Root>
{:else if query.isPending}
	<div class={cn('grid gap-4', className)}>
		{#each Array.from({ length: 8 }, (_, i) => i) as i (i)}
			<div class="space-y-3 rounded-xl border p-0">
				<Skeleton class="aspect-[4/3] w-full rounded-b-none" />
				<div class="space-y-2 p-4">
					<Skeleton class="h-3 w-16" />
					<Skeleton class="h-4 w-full" />
					<Skeleton class="h-6 w-1/2" />
				</div>
			</div>
		{/each}
	</div>
{:else if query.data.length === 0}
	<div class="rounded-xl border border-dashed px-4 py-16 text-center">
		{#if empty}
			{@render empty()}
		{:else}
			<p class="font-medium">Produk tidak ditemukan</p>
			<p class="text-sm text-muted-foreground">Coba kata kunci atau kategori lain.</p>
		{/if}
	</div>
{:else}
	<div
		class={cn('grid gap-4 transition-opacity', className, query.isPlaceholderData && 'opacity-60')}
	>
		{#each query.data as product (product.id)}
			<ProductCard {product} onAddToCart={addToCart} />
		{/each}
	</div>
{/if}
