<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import RiAddLine from 'remixicon-svelte/icons/add-line';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { formatCompact, formatRupiah } from '#lib/format.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	$effect(() => {
		const created = page.url.searchParams.get('created');
		if (!created) return;
		toast.success(`Produk "${created}" berhasil ditambahkan`);
		history.replaceState({}, '', resolve('/admin/produk'));
	});
</script>

<svelte:head>
	<title>Kelola Produk — Admin TokoKomputer</title>
</svelte:head>

<div class="space-y-4">
	<div class="flex flex-wrap items-end justify-between gap-3">
		<div>
			<h2 class="text-lg font-semibold">Daftar produk</h2>
			<p class="text-sm text-muted-foreground">{data.products.length} produk di katalog</p>
		</div>
		<div class="flex flex-wrap gap-2">
			<Button href={resolve('/produk')} variant="outline" size="sm">Lihat di toko</Button>
			<Button href={resolve('/admin/produk/baru')} size="sm">
				<RiAddLine data-icon="inline-start" /> Tambah produk
			</Button>
		</div>
	</div>

	<div class="overflow-x-auto rounded-xl border">
		<table class="w-full min-w-[48rem] text-left text-sm">
			<thead class="border-b bg-muted/50 text-muted-foreground">
				<tr>
					<th class="px-4 py-3 font-medium">Produk</th>
					<th class="px-4 py-3 font-medium">Kategori</th>
					<th class="px-4 py-3 font-medium">Harga</th>
					<th class="px-4 py-3 font-medium">Stok</th>
					<th class="px-4 py-3 font-medium">Terjual</th>
					<th class="px-4 py-3 font-medium">Rating</th>
					<th class="px-4 py-3 font-medium"></th>
				</tr>
			</thead>
			<tbody>
				{#each data.products as product (product.id)}
					<tr class="border-b last:border-0">
						<td class="px-4 py-3">
							<p class="font-medium">{product.name}</p>
							<p class="text-xs text-muted-foreground">{product.brand}</p>
						</td>
						<td class="px-4 py-3 text-muted-foreground">
							{product.categoryName ?? product.category}
						</td>
						<td class="px-4 py-3 tabular-nums">{formatRupiah(product.price)}</td>
						<td class="px-4 py-3">
							{#if product.stock === 0}
								<Badge variant="destructive">Habis</Badge>
							{:else if product.stock <= 5}
								<Badge variant="secondary">{product.stock}</Badge>
							{:else}
								<span class="tabular-nums">{product.stock}</span>
							{/if}
						</td>
						<td class="px-4 py-3 text-muted-foreground tabular-nums">
							{formatCompact(product.sold)}
						</td>
						<td class="px-4 py-3 text-muted-foreground tabular-nums">{product.rating.toFixed(1)}</td
						>
						<td class="px-4 py-3 text-right">
							<Button
								href={resolve('/produk/[slug]', { slug: product.slug })}
								variant="ghost"
								size="sm"
							>
								Buka
							</Button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
