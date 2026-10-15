import axios, { type AxiosInstance } from 'axios';
import type { ApiErrorBody } from '#lib/types.js';

type CreateApiClientOptions = {
	/** SvelteKit's `fetch` from a load function, so SSR requests forward cookies and get inlined for hydration. */
	fetch?: typeof fetch;
	/** Must be absolute on the server, since axios builds a `Request` before calling `fetch`. */
	baseURL?: string;
};

const NULL_BODY_STATUS = [101, 103, 204, 205, 304];

/**
 * Adapts SvelteKit's load `fetch` for axios:
 * - SvelteKit replays SSR-inlined responses during hydration only if the request headers hash the same on
 *   server and client. axios passes a `Request` object (hashed inconsistently by SvelteKit) and adds a
 *   server-only `user-agent`, so the request is re-issued as `(url, init)` with matching headers.
 * - axios reads `response.body` and then `response.text()`. On the server, touching `body` tees the stream
 *   and the later `text()` throws "Body has already been read", so the body is buffered once instead.
 */
function svelteKitFetchAdapter(svelteKitFetch: typeof fetch): typeof fetch {
	return async (input, init) => {
		let res: Response;

		if (input instanceof Request) {
			const headers = new Headers(input.headers);
			// Server-only header (browsers forbid setting it); it would make the server/client hashes differ.
			headers.delete('user-agent');
			const hasBody = input.method !== 'GET' && input.method !== 'HEAD';
			res = await svelteKitFetch(input.url, {
				...init,
				method: input.method,
				headers,
				credentials: input.credentials,
				signal: input.signal,
				body: hasBody ? await input.arrayBuffer() : undefined
			});
		} else {
			res = await svelteKitFetch(input, init);
		}

		const body = NULL_BODY_STATUS.includes(res.status) ? null : await res.arrayBuffer();
		return new Response(body, {
			status: res.status,
			statusText: res.statusText,
			headers: res.headers
		});
	};
}

export function createApiClient({ fetch, baseURL = '/api' }: CreateApiClientOptions = {}) {
	return axios.create({
		baseURL,
		adapter: 'fetch',
		withCredentials: true,
		timeout: 15_000,
		headers: { Accept: 'application/json' },
		...(fetch ? { env: { fetch: svelteKitFetchAdapter(fetch) } } : {})
	});
}

export const api = createApiClient();

export function getErrorMessage(error: unknown, fallback = 'Terjadi kesalahan, coba lagi') {
	if (axios.isAxiosError<ApiErrorBody>(error)) {
		if (error.response?.data?.message) return error.response.data.message;
		if (error.code === 'ECONNABORTED') return 'Koneksi timeout, periksa jaringan Anda';
		if (!error.response) return 'Tidak dapat terhubung ke server';
	}
	return error instanceof Error ? error.message : fallback;
}

export function getFieldErrors(error: unknown) {
	if (axios.isAxiosError<ApiErrorBody>(error)) return error.response?.data?.errors ?? {};
	return {};
}

export type { AxiosInstance };
