import { error } from '@sveltejs/kit';

/**
 * Tolak buka endpoint API langsung dari address bar browser.
 * Request dari fetch app (dan SSR) tetap diizinkan.
 *
 * Catatan: ini mencegah penampilan JSON di tab browser, bukan enkripsi data.
 * Siapa pun yang memanggil API dengan header yang benar tetap bisa membaca respons.
 */
export function rejectBrowserNavigation(request: Request) {
	if (request.headers.get('sec-fetch-dest') === 'document') {
		error(404, 'Not found');
	}
}
