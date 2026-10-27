<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import RiErrorWarningLine from 'remixicon-svelte/icons/error-warning-line';
	import SiteHeader from '#lib/components/site-header.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import type { LayoutProps } from './$types';

	let { data }: { data: LayoutProps['data'] } = $props();

	const status = $derived(page.status);
	const message = $derived(
		page.error?.message ||
			(status === 404
				? 'Halaman yang kamu cari tidak ditemukan.'
				: status === 403
					? 'Kamu tidak punya akses ke halaman ini.'
					: 'Terjadi kesalahan. Coba muat ulang halaman.')
	);
</script>

<SiteHeader user={data.user ?? null} showSearch={false} />

<main
	class="container mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center"
>
	<span
		class="mb-4 flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive"
	>
		<RiErrorWarningLine class="size-7" />
	</span>
	<p class="text-sm font-medium text-muted-foreground">{status}</p>
	<h1 class="mt-1 text-2xl font-bold tracking-tight">
		{#if status === 404}
			Halaman tidak ditemukan
		{:else if status === 403}
			Akses ditolak
		{:else}
			Terjadi kesalahan
		{/if}
	</h1>
	<p class="mt-2 text-muted-foreground">{message}</p>
	<div class="mt-6 flex flex-wrap justify-center gap-2">
		<Button href={resolve('/')}>Kembali ke beranda</Button>
		{#if !data.user}
			<Button href={resolve('/login')} variant="outline">Masuk</Button>
		{/if}
	</div>
</main>
