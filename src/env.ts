import { defineEnvVars } from '@sveltejs/kit/env';
import { z } from 'zod';

export const variables = defineEnvVars({
	DATABASE_URL: {
		schema: z.string().min(1),
		description: 'URL database SQLite/libSQL, mis. `file:local.db` atau `libsql://...` (Turso)'
	},
	DATABASE_AUTH_TOKEN: {
		schema: z.string().optional(),
		description: 'Token auth Turso; kosongkan untuk SQLite lokal'
	}
});
