import { QueryClient } from '@tanstack/svelte-query';
import { browser } from '$app/env';

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				// On the server, queries only read data prefetched in `load`; they never fetch during render.
				enabled: browser,
				staleTime: 1000 * 60,
				retry: 1,
				refetchOnWindowFocus: false
			}
		}
	});
}

let browserQueryClient: QueryClient | undefined;

/** A fresh client per request on the server (no cross-user cache leaks), a singleton in the browser. */
export function getQueryClient() {
	if (!browser) return makeQueryClient();
	return (browserQueryClient ??= makeQueryClient());
}
