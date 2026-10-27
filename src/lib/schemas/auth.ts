import { z } from 'zod';

export const loginSchema = z.object({
	email: z.email('Format email tidak valid'),
	password: z.string().min(6, 'Password minimal 6 karakter'),
	remember: z.boolean().default(false)
});

export const registerSchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(2, 'Nama minimal 2 karakter')
			.max(100, 'Nama maksimal 100 karakter'),
		email: z.email('Format email tidak valid'),
		password: z.string().min(6, 'Password minimal 6 karakter'),
		confirmPassword: z.string().min(1, 'Ulangi password'),
		remember: z.boolean().default(false)
	})
	.refine((d) => d.password === d.confirmPassword, {
		message: 'Konfirmasi password tidak cocok',
		path: ['confirmPassword']
	});
