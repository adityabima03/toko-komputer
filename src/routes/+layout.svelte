<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '#lib/components/ui/sonner/index.js';
	import { dev } from '$app/env';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
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
