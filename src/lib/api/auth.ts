import { mutationOptions } from '@tanstack/svelte-query';
import { api, type AxiosInstance } from './client';

export async function logout(client: AxiosInstance = api) {
	await client.post('/auth/logout');
}

export const logoutMutation = () =>
	mutationOptions({
		mutationKey: ['auth', 'logout'],
		mutationFn: () => logout()
	});
