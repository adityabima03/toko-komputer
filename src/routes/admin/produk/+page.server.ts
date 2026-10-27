import { listAdminProducts } from '#lib/server/data.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { products: await listAdminProducts() };
};
