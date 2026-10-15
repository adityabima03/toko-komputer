<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';
	import RiArrowLeftLine from 'remixicon-svelte/icons/arrow-left-line';
	import RiLoader4Line from 'remixicon-svelte/icons/loader-4-line';
	import RiShoppingCart2Line from 'remixicon-svelte/icons/shopping-cart-2-line';
	import SiteHeader from '#lib/components/site-header.svelte';
	import * as Avatar from '#lib/components/ui/avatar/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Form from '#lib/components/ui/form/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Separator } from '#lib/components/ui/separator/index.js';
	import { initials } from '#lib/format.js';
	import { passwordSchema, profileSchema } from '#lib/schemas/profile.js';
	import { cart } from '#lib/stores/cart.svelte.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const showSuccess = ({ form }: { form: { valid: boolean; message?: unknown } }) => {
		if (form.valid && typeof form.message === 'string') toast.success(form.message);
	};

	// svelte-ignore state_referenced_locally
	const profile = superForm(data.profileForm, {
		validators: zod4Client(profileSchema),
		// Form edit: tampilkan data yang baru disimpan, bukan data awal saat halaman dibuka.
		resetForm: false,
		onUpdated: showSuccess
	});
	const {
		form: profileData,
		enhance: profileEnhance,
		submitting: profileSubmitting,
		tainted: profileTainted,
		isTainted
	} = profile;

	// svelte-ignore state_referenced_locally
	const password = superForm(data.passwordForm, {
		validators: zod4Client(passwordSchema),
		onUpdated: showSuccess
	});
	const { form: passwordData, enhance: passwordEnhance, submitting: passwordSubmitting } = password;

	// `data.user` selalu ada: halaman ini sudah redirect ke /login kalau belum masuk.
	const user = $derived(data.user!);
</script>

<svelte:head>
	<title>Profil Saya — TokoKomputer</title>
</svelte:head>

<SiteHeader {user} showSearch={false} />

<main class="container mx-auto max-w-5xl px-4 py-8 md:py-12">
	<Button variant="ghost" size="sm" href={resolve('/')} class="mb-3 -ml-2.5">
		<RiArrowLeftLine data-icon="inline-start" /> Kembali ke toko
	</Button>

	<h1 class="mb-6 text-2xl font-bold tracking-tight">Profil Saya</h1>

	<div class="grid items-start gap-6 lg:grid-cols-[18rem_1fr]">
		<Card.Root class="lg:sticky lg:top-20">
			<Card.Content class="flex flex-col items-center gap-3 text-center">
				<Avatar.Root class="size-20">
					<Avatar.Fallback class="bg-primary text-2xl font-semibold text-primary-foreground">
						{initials(user.name)}
					</Avatar.Fallback>
				</Avatar.Root>
				<div class="space-y-1">
					<p class="text-lg font-semibold">{user.name}</p>
					<p class="text-sm break-all text-muted-foreground">{user.email}</p>
				</div>
				<Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
					{user.role === 'admin' ? 'Admin' : 'Pelanggan'}
				</Badge>

				<Separator class="my-2" />

				<Button variant="outline" class="w-full" href={resolve('/keranjang')}>
					<RiShoppingCart2Line data-icon="inline-start" />
					Keranjang ({cart.count})
				</Button>
			</Card.Content>
		</Card.Root>

		<div class="grid gap-6">
			<Card.Root>
				<Card.Header>
					<Card.Title>Informasi Akun</Card.Title>
					<Card.Description
						>Nama dan email yang dipakai untuk masuk dan pengiriman.</Card.Description
					>
				</Card.Header>
				<Card.Content>
					<form method="POST" action="?/profile" class="grid gap-4" use:profileEnhance novalidate>
						<Form.Field form={profile} name="name">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Nama lengkap</Form.Label>
									<Input {...props} autocomplete="name" bind:value={$profileData.name} />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field form={profile} name="email">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Email</Form.Label>
									<Input
										{...props}
										type="email"
										autocomplete="email"
										bind:value={$profileData.email}
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<div class="flex justify-end">
							<Button type="submit" disabled={$profileSubmitting || !isTainted($profileTainted)}>
								{#if $profileSubmitting}
									<RiLoader4Line class="animate-spin" /> Menyimpan...
								{:else}
									Simpan Perubahan
								{/if}
							</Button>
						</div>
					</form>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title>Ganti Password</Card.Title>
					<Card.Description>
						Setelah diganti, akunmu akan dikeluarkan dari semua perangkat lain.
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<form method="POST" action="?/password" class="grid gap-4" use:passwordEnhance novalidate>
						<!-- Membantu password manager mengenali akun yang passwordnya diganti. -->
						<input
							type="email"
							name="username"
							value={user.email}
							autocomplete="username"
							class="hidden"
							readonly
							tabindex="-1"
						/>

						<Form.Field form={password} name="currentPassword">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Password saat ini</Form.Label>
									<Input
										{...props}
										type="password"
										autocomplete="current-password"
										bind:value={$passwordData.currentPassword}
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<div class="grid gap-4 sm:grid-cols-2">
							<Form.Field form={password} name="newPassword">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Password baru</Form.Label>
										<Input
											{...props}
											type="password"
											autocomplete="new-password"
											bind:value={$passwordData.newPassword}
										/>
									{/snippet}
								</Form.Control>
								<Form.Description>Minimal 6 karakter.</Form.Description>
								<Form.FieldErrors />
							</Form.Field>

							<Form.Field form={password} name="confirmPassword">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Ulangi password baru</Form.Label>
										<Input
											{...props}
											type="password"
											autocomplete="new-password"
											bind:value={$passwordData.confirmPassword}
										/>
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>

						<div class="flex justify-end">
							<Button type="submit" disabled={$passwordSubmitting}>
								{#if $passwordSubmitting}
									<RiLoader4Line class="animate-spin" /> Memproses...
								{:else}
									Ganti Password
								{/if}
							</Button>
						</div>
					</form>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</main>
