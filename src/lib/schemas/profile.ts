import { z } from 'zod';

export const profileSchema = z.object({
	name: z.string().trim().min(2, 'Nama minimal 2 karakter').max(100, 'Nama maksimal 100 karakter'),
	email: z.email('Format email tidak valid')
});

export const passwordSchema = z
	.object({
		currentPassword: z.string().min(1, 'Password saat ini wajib diisi'),
		newPassword: z.string().min(6, 'Password minimal 6 karakter'),
		confirmPassword: z.string().min(1, 'Ulangi password baru')
	})
	.refine((d) => d.newPassword === d.confirmPassword, {
		message: 'Konfirmasi password tidak cocok',
		path: ['confirmPassword']
	})
	.refine((d) => d.newPassword !== d.currentPassword, {
		message: 'Password baru harus berbeda dari password saat ini',
		path: ['newPassword']
	});
