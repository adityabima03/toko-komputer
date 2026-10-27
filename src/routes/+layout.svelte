<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { ModeWatcher } from 'mode-watcher';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/state';
	import { Toaster } from '#lib/components/ui/sonner/index.js';
	import { dev } from '$app/env';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	const noticeMessages: Record<string, string> = {
		'admin-only': 'Halaman itu hanya bisa diakses oleh admin.'
	};

	$effect(() => {
		const notice = page.url.searchParams.get('notice');
		if (!notice) return;

		const message = noticeMessages[notice];
		if (message) toast.error(message);

		const url = new URL(page.url);
		url.searchParams.delete('notice');
		history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>TokoKomputer — Laptop, PC Rakitan & Komponen</title>
</svelte:head>

<ModeWatcher />
<Toaster richColors position="top-center" />

<QueryClientProvider client={data.queryClient}>
	{@render children()}

	{#if dev}
		<SvelteQueryDevtools buttonPosition="bottom-left" />
	{/if}
</QueryClientProvider>
