import { defineEnvVars } from '@sveltejs/kit/env';
import { z } from 'zod';

export const variables = defineEnvVars({
	DATABASE_URL: {
		schema: z.string().min(1),
		description:
			'URL MySQL, mis. `mysql://root:@127.0.0.1:3306/toko_komputer` (Laragon password biasanya kosong)'
	}
});
