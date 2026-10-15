import { getQueryClient } from '#lib/query-client.js';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
	return { ...data, queryClient: getQueryClient() };
};
