<script lang="ts">
	import { createMutation } from '@tanstack/svelte-query';
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';
	import RiUserLine from 'remixicon-svelte/icons/user-line';
	import RiDashboardLine from 'remixicon-svelte/icons/dashboard-line';
	import RiShoppingCart2Line from 'remixicon-svelte/icons/shopping-cart-2-line';
	import RiLogoutBoxRLine from 'remixicon-svelte/icons/logout-box-r-line';
	import * as Avatar from '#lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '#lib/components/ui/dropdown-menu/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { logoutMutation } from '#lib/api/auth.js';
	import { getErrorMessage } from '#lib/api/client.js';
	import { initials } from '#lib/format.js';
	import type { User } from '#lib/types.js';

	let { user }: { user: User } = $props();

	const logout = createMutation(() => ({
		...logoutMutation(),
		onSuccess: async () => {
			await invalidateAll();
			toast.success('Berhasil keluar');
		},
		onError: (error) => toast.error(getErrorMessage(error))
	}));
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
		aria-label="Menu akun"
	>
		<Avatar.Root>
			<Avatar.Fallback class="bg-primary text-xs font-semibold text-primary-foreground">
				{initials(user.name)}
			</Avatar.Fallback>
		</Avatar.Root>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="w-56">
		<DropdownMenu.Label class="flex flex-col gap-0.5">
			<span class="flex items-center gap-2 font-medium text-foreground">
				{user.name}
				{#if user.role === 'admin'}
					<Badge variant="secondary">Admin</Badge>
				{/if}
			</span>
			<span class="text-xs font-normal text-muted-foreground">{user.email}</span>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
		{#if user.role === 'admin'}
			<DropdownMenu.Item onSelect={() => goto(resolve('/admin'))}>
				<RiDashboardLine /> Panel Admin
			</DropdownMenu.Item>
		{/if}
		<DropdownMenu.Item onSelect={() => goto(resolve('/profil'))}>
			<RiUserLine /> Profil Saya
		</DropdownMenu.Item>
		<DropdownMenu.Item disabled>
			<RiShoppingCart2Line /> Pesanan Saya
		</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item
			variant="destructive"
			disabled={logout.isPending}
			onSelect={() => logout.mutate()}
		>
			<RiLogoutBoxRLine /> Keluar
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
