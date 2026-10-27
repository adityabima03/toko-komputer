<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';
	import RiArrowLeftLine from 'remixicon-svelte/icons/arrow-left-line';
	import RiLoader4Line from 'remixicon-svelte/icons/loader-4-line';
	import RiImageAddLine from 'remixicon-svelte/icons/image-add-line';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Form from '#lib/components/ui/form/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { createProductSchema } from '#lib/schemas/product.js';
	import { groupCategories } from '#lib/categories.js';
	import { cn } from '#lib/utils.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const groups = $derived(groupCategories(data.categories));
	let previewUrl = $state<string | null>(null);

	// svelte-ignore state_referenced_locally
	const form = superForm(data.form, {
		validators: zod4Client(createProductSchema),
		onError: () => toast.error('Tidak dapat terhubung ke server, coba lagi')
	});

	const { form: formData, enhance, submitting } = form;

	const inputClass = cn(
		'h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none',
		'placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
		'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30'
	);

	function onImageFileChange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		$formData.imageFile = file;

		if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);

		if (file && file.size > 0) {
			previewUrl = URL.createObjectURL(file);
			$formData.imageUrl = '';
		} else {
			previewUrl = null;
		}
	}

	$effect(() => {
		return () => {
			if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
		};
	});
</script>

<svelte:head>
	<title>Tambah Produk — Admin TokoKomputer</title>
</svelte:head>

<div class="space-y-4">
	<div class="flex flex-wrap items-center justify-between gap-3">
		<div>
			<h2 class="text-lg font-semibold">Tambah produk</h2>
			<p class="text-sm text-muted-foreground">Produk baru akan langsung muncul di katalog toko.</p>
		</div>
		<Button href={resolve('/admin/produk')} variant="ghost" size="sm">
			<RiArrowLeftLine data-icon="inline-start" /> Kembali
		</Button>
	</div>

	<Card.Root>
		<Card.Content>
			<form method="POST" enctype="multipart/form-data" class="grid gap-4" use:enhance novalidate>
				<div class="grid gap-4 md:grid-cols-2">
					<Form.Field {form} name="name" class="md:col-span-2">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Nama produk</Form.Label>
								<Input
									{...props}
									placeholder="Contoh: ASUS TUF Gaming A15"
									bind:value={$formData.name}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="slug" class="md:col-span-2">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Slug URL (opsional)</Form.Label>
								<Input
									{...props}
									placeholder="Otomatis dari nama jika dikosongkan"
									bind:value={$formData.slug}
								/>
							{/snippet}
						</Form.Control>
						<Form.Description>Contoh: asus-tuf-gaming-a15</Form.Description>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="brand">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Brand</Form.Label>
								<Input {...props} placeholder="ASUS" bind:value={$formData.brand} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="category">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Kategori</Form.Label>
								<select {...props} class={inputClass} bind:value={$formData.category}>
									<option value="" disabled>Pilih kategori</option>
									{#each groups as group (group.name)}
										<optgroup label={group.name}>
											{#each group.categories as category (category.slug)}
												<option value={category.slug}>{category.name}</option>
											{/each}
										</optgroup>
									{/each}
								</select>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="price">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Harga jual (Rp)</Form.Label>
								<Input
									{...props}
									type="number"
									inputmode="numeric"
									min="1"
									step="1000"
									placeholder="1500000"
									bind:value={$formData.price}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="originalPrice">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Harga coret (opsional)</Form.Label>
								<Input
									{...props}
									type="number"
									inputmode="numeric"
									min="1"
									step="1000"
									placeholder="Kosongkan jika tidak ada diskon"
									bind:value={$formData.originalPrice}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="stock">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Stok</Form.Label>
								<Input
									{...props}
									type="number"
									inputmode="numeric"
									min="0"
									step="1"
									placeholder="10"
									bind:value={$formData.stock}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<div class="grid gap-4 md:col-span-2 md:grid-cols-[12rem_1fr]">
						<div
							class="flex aspect-square items-center justify-center overflow-hidden rounded-xl border bg-muted/40"
						>
							{#if previewUrl || $formData.imageUrl}
								<img
									src={previewUrl || $formData.imageUrl}
									alt="Pratinjau produk"
									class="size-full object-cover"
								/>
							{:else}
								<div class="flex flex-col items-center gap-2 p-4 text-center text-muted-foreground">
									<RiImageAddLine class="size-8" />
									<p class="text-xs">Pratinjau gambar</p>
								</div>
							{/if}
						</div>

						<div class="grid content-start gap-4">
							<Form.Field {form} name="imageFile">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Upload gambar</Form.Label>
										<Input
											{...props}
											type="file"
											accept="image/jpeg,image/png,image/webp,image/gif"
											onchange={onImageFileChange}
										/>
									{/snippet}
								</Form.Control>
								<Form.Description>JPG, PNG, WEBP, atau GIF. Maksimal 2 MB.</Form.Description>
								<Form.FieldErrors />
							</Form.Field>

							<Form.Field {form} name="imageUrl">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Atau URL gambar</Form.Label>
										<Input
											{...props}
											type="url"
											placeholder="https://images.unsplash.com/..."
											bind:value={$formData.imageUrl}
											oninput={() => {
												if ($formData.imageUrl.trim()) {
													$formData.imageFile = undefined;
													if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
													previewUrl = null;
												}
											}}
										/>
									{/snippet}
								</Form.Control>
								<Form.Description>Isi salah satu: upload file atau URL.</Form.Description>
								<Form.FieldErrors />
							</Form.Field>
						</div>
					</div>

					<Form.Field {form} name="specs" class="md:col-span-2">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Spesifikasi</Form.Label>
								<textarea
									{...props}
									rows="4"
									class={cn(inputClass, 'h-auto min-h-24 py-2')}
									placeholder={'Satu spesifikasi per baris, contoh:\nRyzen 7 7735HS\nRTX 4060 8GB\n16GB DDR5'}
									bind:value={$formData.specs}></textarea>
							{/snippet}
						</Form.Control>
						<Form.Description>Pisahkan dengan baris baru atau koma.</Form.Description>
						<Form.FieldErrors />
					</Form.Field>
				</div>

				<div class="flex flex-wrap gap-2 pt-2">
					<Button type="submit" disabled={$submitting}>
						{#if $submitting}
							<RiLoader4Line class="animate-spin" /> Menyimpan...
						{:else}
							Simpan produk
						{/if}
					</Button>
					<Button href={resolve('/admin/produk')} variant="outline" disabled={$submitting}>
						Batal
					</Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
