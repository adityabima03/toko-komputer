<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import RiComputerLine from 'remixicon-svelte/icons/computer-line';
	import RiMailLine from 'remixicon-svelte/icons/mail-line';
	import RiLockLine from 'remixicon-svelte/icons/lock-line';
	import RiUserLine from 'remixicon-svelte/icons/user-line';
	import RiEyeLine from 'remixicon-svelte/icons/eye-line';
	import RiEyeOffLine from 'remixicon-svelte/icons/eye-off-line';
	import RiLoader4Line from 'remixicon-svelte/icons/loader-4-line';
	import RiErrorWarningLine from 'remixicon-svelte/icons/error-warning-line';
	import RiShieldCheckLine from 'remixicon-svelte/icons/shield-check-line';
	import RiTruckLine from 'remixicon-svelte/icons/truck-line';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Alert from '#lib/components/ui/alert/index.js';
	import * as Form from '#lib/components/ui/form/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Checkbox } from '#lib/components/ui/checkbox/index.js';
	import ThemeToggle from '#lib/components/theme-toggle.svelte';
	import { registerSchema } from '#lib/schemas/auth.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let showPassword = $state(false);
	let showConfirmPassword = $state(false);

	const loginHref = $derived.by(() => {
		const redirectTo = page.url.searchParams.get('redirectTo');
		return redirectTo
			? resolve(`/login?redirectTo=${encodeURIComponent(redirectTo)}`)
			: resolve('/login');
	});

	// svelte-ignore state_referenced_locally
	const form = superForm(data.form, {
		validators: zod4Client(registerSchema),
		onResult: ({ result }) => {
			if (result.type === 'redirect') toast.success('Akun berhasil dibuat. Selamat berbelanja!');
		},
		onError: () => {
			message.set('Tidak dapat terhubung ke server, coba lagi');
		}
	});

	const { form: formData, enhance, message, submitting } = form;
</script>

<svelte:head>
	<title>Daftar — TokoKomputer</title>
</svelte:head>

<div class="grid min-h-svh lg:grid-cols-2">
	<aside
		class="relative hidden flex-col justify-between overflow-hidden bg-zinc-950 p-10 text-zinc-50 lg:flex"
	>
		<div
			class="absolute -top-24 -right-24 size-96 rounded-full bg-primary/30 blur-3xl"
			aria-hidden="true"
		></div>
		<div
			class="absolute -bottom-32 -left-16 size-80 rounded-full bg-primary/20 blur-3xl"
			aria-hidden="true"
		></div>

		<a href={resolve('/')} class="relative flex items-center gap-2 text-lg font-semibold">
			<span
				class="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"
			>
				<RiComputerLine class="size-5" />
			</span>
			TokoKomputer
		</a>

		<div class="relative space-y-6">
			<h2 class="text-3xl font-bold tracking-tight text-balance">
				Buat akun gratis dan mulai belanja perangkat terbaik.
			</h2>
			<ul class="space-y-3 text-sm text-zinc-300">
				<li class="flex items-center gap-2">
					<RiShieldCheckLine class="size-5 text-primary" /> Data akun aman dan terenkripsi
				</li>
				<li class="flex items-center gap-2">
					<RiTruckLine class="size-5 text-primary" /> Checkout lebih cepat setelah daftar
				</li>
			</ul>
		</div>

		<p class="relative text-xs text-zinc-400">© {new Date().getFullYear()} TokoKomputer</p>
	</aside>

	<main class="flex flex-col">
		<div class="flex items-center justify-between p-4">
			<a href={resolve('/')} class="flex items-center gap-2 font-semibold lg:invisible">
				<span
					class="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
				>
					<RiComputerLine class="size-5" />
				</span>
				TokoKomputer
			</a>
			<ThemeToggle />
		</div>

		<div class="flex flex-1 items-center justify-center p-4">
			<Card.Root class="w-full max-w-sm">
				<Card.Header>
					<Card.Title class="text-2xl">Daftar akun baru</Card.Title>
					<Card.Description>Isi data di bawah untuk membuat akun customer.</Card.Description>
				</Card.Header>

				<Card.Content>
					<form method="POST" class="grid gap-4" use:enhance novalidate>
						{#if $message}
							<Alert.Root variant="destructive">
								<RiErrorWarningLine />
								<Alert.Title>Pendaftaran gagal</Alert.Title>
								<Alert.Description>{$message}</Alert.Description>
							</Alert.Root>
						{/if}

						<Form.Field {form} name="name">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Nama lengkap</Form.Label>
									<div class="relative">
										<RiUserLine
											class="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
										/>
										<Input
											{...props}
											type="text"
											autocomplete="name"
											placeholder="Nama kamu"
											class="pl-8"
											bind:value={$formData.name}
										/>
									</div>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="email">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Email</Form.Label>
									<div class="relative">
										<RiMailLine
											class="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
										/>
										<Input
											{...props}
											type="email"
											autocomplete="email"
											placeholder="nama@email.com"
											class="pl-8"
											bind:value={$formData.email}
										/>
									</div>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="password">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Password</Form.Label>
									<div class="relative">
										<RiLockLine
											class="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
										/>
										<Input
											{...props}
											type={showPassword ? 'text' : 'password'}
											autocomplete="new-password"
											placeholder="Minimal 6 karakter"
											class="px-8"
											bind:value={$formData.password}
										/>
										<button
											type="button"
											class="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
											onclick={() => (showPassword = !showPassword)}
											aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
										>
											{#if showPassword}
												<RiEyeOffLine class="size-4" />
											{:else}
												<RiEyeLine class="size-4" />
											{/if}
										</button>
									</div>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="confirmPassword">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Ulangi password</Form.Label>
									<div class="relative">
										<RiLockLine
											class="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
										/>
										<Input
											{...props}
											type={showConfirmPassword ? 'text' : 'password'}
											autocomplete="new-password"
											placeholder="Ulangi password"
											class="px-8"
											bind:value={$formData.confirmPassword}
										/>
										<button
											type="button"
											class="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
											onclick={() => (showConfirmPassword = !showConfirmPassword)}
											aria-label={showConfirmPassword
												? 'Sembunyikan konfirmasi password'
												: 'Tampilkan konfirmasi password'}
										>
											{#if showConfirmPassword}
												<RiEyeOffLine class="size-4" />
											{:else}
												<RiEyeLine class="size-4" />
											{/if}
										</button>
									</div>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="remember">
							<Form.Control>
								{#snippet children({ props })}
									<div class="flex items-center gap-2">
										<Checkbox {...props} bind:checked={$formData.remember} />
										<Form.Label class="font-normal">Ingat saya selama 30 hari</Form.Label>
									</div>
								{/snippet}
							</Form.Control>
						</Form.Field>

						<Button type="submit" size="lg" class="w-full" disabled={$submitting}>
							{#if $submitting}
								<RiLoader4Line class="animate-spin" /> Memproses...
							{:else}
								Buat akun
							{/if}
						</Button>
					</form>
				</Card.Content>

				<Card.Footer class="justify-center text-sm text-muted-foreground">
					Sudah punya akun?
					<a
						href={loginHref}
						class="ml-1 font-medium text-primary underline-offset-4 hover:underline"
					>
						Masuk
					</a>
				</Card.Footer>
			</Card.Root>
		</div>
	</main>
</div>
