<script lang="ts">
	import { resolve } from '$app/paths';
	import RiComputerLine from 'remixicon-svelte/icons/computer-line';
	import RiLayoutGridLine from 'remixicon-svelte/icons/layout-grid-line';
	import RiSearchLine from 'remixicon-svelte/icons/search-line';
	import RiShoppingCart2Line from 'remixicon-svelte/icons/shopping-cart-2-line';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import ThemeToggle from './theme-toggle.svelte';
	import UserMenu from './user-menu.svelte';
	import { cart } from '#lib/stores/cart.svelte.js';
	import type { User } from '#lib/types.js';

	let {
		user,
		search = $bindable(''),
		showSearch = true
	}: { user: User | null; search?: string; showSearch?: boolean } = $props();
</script>

<header class="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
	<div class="container mx-auto flex h-16 items-center gap-4 px-4">
		<a href={resolve('/')} class="flex shrink-0 items-center gap-2 font-semibold">
			<span
				class="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
			>
				<RiComputerLine class="size-5" />
			</span>
			<span class="hidden sm:inline">TokoKomputer</span>
		</a>

		{#if showSearch}
			<div class="relative mx-auto w-full max-w-xl">
				<RiSearchLine
					class="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
				/>
				<Input
					type="search"
					placeholder="Cari laptop, VGA, monitor..."
					class="pl-8"
					bind:value={search}
					aria-label="Cari produk"
				/>
			</div>
		{/if}

		<div class={['flex shrink-0 items-center gap-1', !showSearch && 'ml-auto']}>
			<Button variant="ghost" size="sm" href={resolve('/produk')} class="hidden md:inline-flex">
				<RiLayoutGridLine data-icon="inline-start" /> Katalog
			</Button>
			<ThemeToggle />
			<Button
				variant="ghost"
				size="icon"
				class="relative"
				href={resolve('/keranjang')}
				aria-label="Keranjang ({cart.count} item)"
			>
				<RiShoppingCart2Line />
				{#if cart.count > 0}
					<span
						class="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground"
					>
						{cart.count > 99 ? '99+' : cart.count}
					</span>
				{/if}
			</Button>
			{#if user}
				<div class="ml-1"><UserMenu {user} /></div>
			{:else}
				<Button href={resolve('/login')} size="sm" class="ml-1">Masuk</Button>
			{/if}
		</div>
	</div>
</header>
