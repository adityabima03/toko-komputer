<script lang="ts">
	import { createMutation } from '@tanstack/svelte-query';
	import { z } from 'zod';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import RiComputerLine from 'remixicon-svelte/icons/computer-line';
	import RiMailLine from 'remixicon-svelte/icons/mail-line';
	import RiLockLine from 'remixicon-svelte/icons/lock-line';
	import RiEyeLine from 'remixicon-svelte/icons/eye-line';
	import RiEyeOffLine from 'remixicon-svelte/icons/eye-off-line';
	import RiLoader4Line from 'remixicon-svelte/icons/loader-4-line';
	import RiErrorWarningLine from 'remixicon-svelte/icons/error-warning-line';
	import RiShieldCheckLine from 'remixicon-svelte/icons/shield-check-line';
	import RiTruckLine from 'remixicon-svelte/icons/truck-line';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Alert from '#lib/components/ui/alert/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import { Checkbox } from '#lib/components/ui/checkbox/index.js';
	import ThemeToggle from '#lib/components/theme-toggle.svelte';
	import { loginMutation } from '#lib/api/auth.js';
	import { getErrorMessage, getFieldErrors } from '#lib/api/client.js';
	import { loginSchema } from '#lib/schemas/auth.js';
	import { safeRedirect } from '#lib/redirect.js';

	type FieldErrors = Partial<Record<'email' | 'password', string[]>>;

	let email = $state('');
	let password = $state('');
	let remember = $state(false);
	let showPassword = $state(false);
	let fieldErrors = $state<FieldErrors>({});

	const redirectTo = $derived(safeRedirect(page.url.searchParams.get('redirectTo')));

	const login = createMutation(() => ({
		...loginMutation(),
		onSuccess: async (user) => {
			toast.success(`Selamat datang, ${user.name}!`);
			// `redirectTo` is an arbitrary same-origin path already validated by `safeRedirect`.
			// eslint-disable-next-line svelte/no-navigation-without-resolve
			await goto(redirectTo, { invalidateAll: true });
		},
		onError: (error) => {
			fieldErrors = getFieldErrors(error) as FieldErrors;
		}
	}));

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		login.reset();

		const result = loginSchema.safeParse({ email, password, remember });
		if (!result.success) {
			fieldErrors = z.flattenError(result.error).fieldErrors;
			return;
		}

		fieldErrors = {};
		login.mutate(result.data);
	}

	function fillDemo() {
		email = 'admin@tokokomputer.id';
		password = 'admin123';
		fieldErrors = {};
	}

	const serverError = $derived(
		login.isError && Object.keys(fieldErrors).length === 0 ? getErrorMessage(login.error) : null
	);
</script>

<svelte:head>
	<title>Masuk — TokoKomputer</title>
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
				Rakit PC impian dan temukan laptop terbaik dengan harga bersahabat.
			</h2>
			<ul class="space-y-3 text-sm text-zinc-300">
				<li class="flex items-center gap-2">
					<RiShieldCheckLine class="size-5 text-primary" /> Garansi resmi untuk semua produk
				</li>
				<li class="flex items-center gap-2">
					<RiTruckLine class="size-5 text-primary" /> Pengiriman cepat ke seluruh Indonesia
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
					<Card.Title class="text-2xl">Masuk ke akun</Card.Title>
					<Card.Description>Masukkan email dan password untuk melanjutkan belanja.</Card.Description
					>
				</Card.Header>

				<Card.Content>
					<form class="grid gap-4" onsubmit={handleSubmit} novalidate>
						{#if serverError}
							<Alert.Root variant="destructive">
								<RiErrorWarningLine />
								<Alert.Title>Login gagal</Alert.Title>
								<Alert.Description>{serverError}</Alert.Description>
							</Alert.Root>
						{/if}

						<div class="grid gap-1.5">
							<Label for="email">Email</Label>
							<div class="relative">
								<RiMailLine
									class="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
								/>
								<Input
									id="email"
									type="email"
									autocomplete="email"
									placeholder="nama@email.com"
									class="pl-8"
									bind:value={email}
									aria-invalid={fieldErrors.email ? true : undefined}
									aria-describedby={fieldErrors.email ? 'email-error' : undefined}
								/>
							</div>
							{#if fieldErrors.email}
								<p id="email-error" class="text-xs text-destructive">{fieldErrors.email[0]}</p>
							{/if}
						</div>

						<div class="grid gap-1.5">
							<div class="flex items-center justify-between">
								<Label for="password">Password</Label>
								<button
									type="button"
									class="text-xs text-muted-foreground underline-offset-4 hover:underline"
									onclick={() => toast.info('Fitur reset password belum tersedia')}
								>
									Lupa password?
								</button>
							</div>
							<div class="relative">
								<RiLockLine
									class="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
								/>
								<Input
									id="password"
									type={showPassword ? 'text' : 'password'}
									autocomplete="current-password"
									placeholder="••••••••"
									class="px-8"
									bind:value={password}
									aria-invalid={fieldErrors.password ? true : undefined}
									aria-describedby={fieldErrors.password ? 'password-error' : undefined}
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
							{#if fieldErrors.password}
								<p id="password-error" class="text-xs text-destructive">
									{fieldErrors.password[0]}
								</p>
							{/if}
						</div>

						<div class="flex items-center gap-2">
							<Checkbox id="remember" bind:checked={remember} />
							<Label for="remember" class="font-normal">Ingat saya selama 30 hari</Label>
						</div>

						<Button type="submit" size="lg" class="w-full" disabled={login.isPending}>
							{#if login.isPending}
								<RiLoader4Line class="animate-spin" /> Memproses...
							{:else}
								Masuk
							{/if}
						</Button>
					</form>
				</Card.Content>

				<Card.Footer class="flex-col items-stretch gap-2">
					<div
						class="rounded-lg border border-dashed bg-muted/50 p-3 text-xs text-muted-foreground"
					>
						<p class="mb-1 font-medium text-foreground">Akun demo</p>
						<p>admin@tokokomputer.id / admin123</p>
						<p>budi@example.com / budi123</p>
						<Button variant="link" size="xs" class="mt-1 h-auto px-0" onclick={fillDemo}>
							Isi otomatis akun admin
						</Button>
					</div>
				</Card.Footer>
			</Card.Root>
		</div>
	</main>
</div>
