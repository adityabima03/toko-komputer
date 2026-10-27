import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import {
	createProductSchema,
	hasUploadedFileValue,
	parseOptionalPrice
} from '#lib/schemas/product.js';
import { createProduct, listCategories } from '#lib/server/data.js';
import { saveProductImage } from '#lib/server/upload.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [form, categories] = await Promise.all([
		superValidate(zod4(createProductSchema)),
		listCategories()
	]);

	return { form, categories };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(createProductSchema));
		if (!form.valid) return fail(400, { form });

		let image = form.data.imageUrl.trim();
		if (hasUploadedFileValue(form.data.imageFile)) {
			try {
				image = await saveProductImage(form.data.imageFile);
			} catch {
				return setError(form, 'imageFile', 'Gagal menyimpan gambar, coba file lain');
			}
		}

		if (!image) {
			return setError(form, 'imageFile', 'Upload gambar atau isi URL gambar');
		}

		const result = await createProduct({
			name: form.data.name,
			slug: form.data.slug || undefined,
			category: form.data.category,
			brand: form.data.brand,
			price: form.data.price,
			originalPrice: parseOptionalPrice(form.data.originalPrice),
			stock: form.data.stock,
			specs: form.data.specs,
			image
		});

		if ('error' in result) {
			if (result.error === 'category') {
				return setError(form, 'category', 'Kategori tidak ditemukan');
			}
			if (result.error === 'slug' || result.error === 'slug_taken') {
				return setError(
					form,
					'slug',
					result.error === 'slug_taken'
						? 'Slug sudah dipakai produk lain'
						: 'Slug tidak valid, isi nama produk atau slug manual'
				);
			}
			return setError(form, 'name', 'Gagal menyimpan produk, coba lagi');
		}

		redirect(303, `/admin/produk?created=${encodeURIComponent(result.product.slug)}`);
	}
} satisfies Actions;
