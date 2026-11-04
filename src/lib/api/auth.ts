import { mutationOptions } from '@tanstack/svelte-query';
import { api, type AxiosInstance } from './client';

export async function logout(client: AxiosInstance = api) {
	const { data } = await client.post<{ ok: boolean }>('/auth/logout');
	return data;
}

export const logoutMutation = () =>
	mutationOptions({
		mutationKey: ['auth', 'logout'],
		mutationFn: () => logout()
	});
