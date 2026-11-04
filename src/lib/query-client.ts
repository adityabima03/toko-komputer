import { QueryClient } from '@tanstack/svelte-query';
import { browser } from '$app/env';

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 1000 * 30,
				retry: 1,
				refetchOnWindowFocus: false
			}
		}
	});
}

let browserQueryClient: QueryClient | undefined;

/** Satu client di browser; di server selalu instance baru agar data tidak bocor antar-request. */
export function getQueryClient() {
	if (!browser) return makeQueryClient();
	return (browserQueryClient ??= makeQueryClient());
}
