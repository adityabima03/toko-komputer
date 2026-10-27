<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import RiDashboardLine from 'remixicon-svelte/icons/dashboard-line';
	import RiStoreLine from 'remixicon-svelte/icons/store-line';
	import RiArrowLeftLine from 'remixicon-svelte/icons/arrow-left-line';
	import SiteHeader from '#lib/components/site-header.svelte';
	import { cn } from '#lib/utils.js';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	const nav = [
		{ href: '/admin', label: 'Dashboard', icon: RiDashboardLine, exact: true },
		{ href: '/admin/produk', label: 'Produk', icon: RiStoreLine, exact: false }
	] as const;

	function isActive(href: string, exact: boolean) {
		const path = page.url.pathname;
		return exact ? path === href : path === href || path.startsWith(`${href}/`);
	}
</script>

<SiteHeader user={data.user} showSearch={false} />

<main class="container mx-auto px-4 py-8">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-3">
		<div>
			<p class="text-sm font-medium text-primary">Panel Admin</p>
			<h1 class="text-2xl font-bold tracking-tight">Kelola toko</h1>
			<p class="text-sm text-muted-foreground">
				Masuk sebagai {data.user.name} · akses terbatas untuk admin
			</p>
		</div>
		<a
			href={resolve('/')}
			class="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
		>
			<RiArrowLeftLine class="size-4" /> Kembali ke toko
		</a>
	</div>

	<div class="grid items-start gap-8 lg:grid-cols-[14rem_1fr]">
		<aside class="rounded-xl border bg-card p-2" aria-label="Navigasi admin">
			<nav class="grid gap-1">
				{#each nav as item (item.href)}
					{@const active = isActive(item.href, item.exact)}
					<a
						href={resolve(item.href)}
						class={cn(
							'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted',
							active && 'bg-primary/10 font-medium text-primary hover:bg-primary/15'
						)}
						aria-current={active ? 'page' : undefined}
					>
						<item.icon class="size-4 shrink-0" />
						{item.label}
					</a>
				{/each}
			</nav>
		</aside>

		<section class="min-w-0">
			{@render children()}
		</section>
	</div>
</main>
