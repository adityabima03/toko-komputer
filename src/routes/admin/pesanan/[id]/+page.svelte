<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';
	import RiArrowLeftLine from 'remixicon-svelte/icons/arrow-left-line';
	import RiLoader4Line from 'remixicon-svelte/icons/loader-4-line';
	import * as Card from '#lib/components/ui/card/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Separator } from '#lib/components/ui/separator/index.js';
	import { formatDateTime, formatRupiah } from '#lib/format.js';
	import {
		ADMIN_STATUS_TRANSITIONS,
		ORDER_STATUS_LABEL,
		ORDER_STATUS_VARIANT
	} from '#lib/order-status.js';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	let saving = $state(false);
	const nextStatuses = $derived(ADMIN_STATUS_TRANSITIONS[data.order.status]);

	$effect(() => {
		if (form?.statusOk && form.nextStatus) {
			toast.success(`Status diubah ke ${ORDER_STATUS_LABEL[form.nextStatus]}`);
		}
		if (form?.statusError) toast.error(form.statusError);
	});
</script>

<svelte:head>
	<title>Pesanan #{data.order.id.slice(-8).toUpperCase()} — Admin</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<Button variant="ghost" size="sm" href={resolve('/admin/pesanan')} class="mb-2 -ml-2.5">
			<RiArrowLeftLine data-icon="inline-start" /> Semua pesanan
		</Button>
		<div class="flex flex-wrap items-center gap-2">
			<h2 class="text-lg font-semibold">Pesanan #{data.order.id.slice(-8).toUpperCase()}</h2>
			<Badge variant={ORDER_STATUS_VARIANT[data.order.status]}>
				{ORDER_STATUS_LABEL[data.order.status]}
			</Badge>
		</div>
		<p class="text-sm text-muted-foreground">
			{data.customer.name} · {data.customer.email} · {formatDateTime(data.order.createdAt)}
		</p>
	</div>

	<div class="grid items-start gap-6 lg:grid-cols-[1fr_18rem]">
		<div class="grid gap-6">
			{#if data.order.paymentProof === 'simulator:qris'}
				<div class="rounded-xl border bg-muted/40 p-6 text-sm">
					Pembayaran via <span class="font-medium">QRIS simulasi lokal</span>
					{#if data.order.paidAt}
						· lunas {formatDateTime(data.order.paidAt)}
					{/if}
				</div>
			{:else if data.order.paymentProof}
				<Card.Root>
					<Card.Header>
						<Card.Title>Bukti transfer</Card.Title>
						{#if data.order.status === 'menunggu_pembayaran'}
							<Card.Description>Periksa bukti, lalu konfirmasi sebagai dibayar.</Card.Description>
						{/if}
					</Card.Header>
					<Card.Content>
						<a
							href={data.order.paymentProof}
							target="_blank"
							rel="noreferrer"
							class="block overflow-hidden rounded-xl border"
						>
							<img
								src={data.order.paymentProof}
								alt="Bukti transfer"
								class="max-h-80 w-full object-contain bg-muted/40"
							/>
						</a>
					</Card.Content>
				</Card.Root>
			{:else if data.order.status === 'menunggu_pembayaran'}
				<div class="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
					Pelanggan belum mengunggah bukti transfer.
				</div>
			{/if}

			<Card.Root class="gap-0 py-0">
				<Card.Header class="px-4 pt-4 pb-0">
					<Card.Title>Item</Card.Title>
				</Card.Header>
				<ul class="divide-y">
					{#each data.order.items as item (item.id)}
						<li class="flex justify-between gap-4 p-4 text-sm">
							<div class="min-w-0">
								<p class="font-medium">{item.productName}</p>
								<p class="text-muted-foreground">
									{item.qty} × {formatRupiah(item.price)}
								</p>
							</div>
							<p class="shrink-0 font-semibold tabular-nums">{formatRupiah(item.lineTotal)}</p>
						</li>
					{/each}
				</ul>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title>Alamat pengiriman</Card.Title>
				</Card.Header>
				<Card.Content class="space-y-1 text-sm">
					<p class="font-medium">{data.order.recipientName}</p>
					<p class="text-muted-foreground">{data.order.phone}</p>
					<p class="text-muted-foreground">
						{data.order.addressLine}<br />
						{data.order.city}, {data.order.province} {data.order.postalCode}
					</p>
				</Card.Content>
			</Card.Root>
		</div>

		<Card.Root class="lg:sticky lg:top-20">
			<Card.Header>
				<Card.Title>Ringkasan</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-3 text-sm">
				<div class="flex justify-between">
					<span class="text-muted-foreground">Subtotal</span>
					<span class="tabular-nums">{formatRupiah(data.order.subtotal)}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-muted-foreground">Ongkir</span>
					<span class="tabular-nums">{formatRupiah(data.order.shippingFee)}</span>
				</div>
				<Separator />
				<div class="flex items-baseline justify-between">
					<span class="font-medium">Total</span>
					<span class="text-lg font-bold tabular-nums">{formatRupiah(data.order.total)}</span>
				</div>
			</Card.Content>
			{#if nextStatuses.length > 0}
				<Card.Footer class="flex-col gap-2">
					{#each nextStatuses as status (status)}
						<form
							method="POST"
							action="?/status"
							class="w-full"
							use:enhance={() => {
								saving = true;
								return async ({ update }) => {
									saving = false;
									await update();
								};
							}}
						>
							<input type="hidden" name="status" value={status} />
							<Button
								type="submit"
								class="w-full"
								variant={status === 'dibatalkan' ? 'outline' : 'default'}
								disabled={saving}
								onclick={(e) => {
									if (
										status === 'dibatalkan' &&
										!confirm('Batalkan pesanan? Stok akan dikembalikan.')
									) {
										e.preventDefault();
									}
								}}
							>
								{#if saving}
									<RiLoader4Line class="animate-spin" /> Menyimpan...
								{:else if status === 'dibayar'}
									Konfirmasi Dibayar
								{:else if status === 'dikirim'}
									Tandai Dikirim
								{:else if status === 'selesai'}
									Tandai Selesai
								{:else}
									Batalkan Pesanan
								{/if}
							</Button>
						</form>
					{/each}
				</Card.Footer>
			{/if}
		</Card.Root>
	</div>
</div>
