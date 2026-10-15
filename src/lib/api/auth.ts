import { mutationOptions } from '@tanstack/svelte-query';
import type { LoginInput } from '#lib/schemas/auth.js';
import type { User } from '#lib/types.js';
import { api, type AxiosInstance } from './client';

export async function login(input: LoginInput, client: AxiosInstance = api) {
	const { data } = await client.post<{ user: User }>('/auth/login', input);
	return data.user;
}

export async function logout(client: AxiosInstance = api) {
	await client.post('/auth/logout');
}

export const loginMutation = () =>
	mutationOptions({
		mutationKey: ['auth', 'login'],
		mutationFn: (input: LoginInput) => login(input)
	});

export const logoutMutation = () =>
	mutationOptions({
		mutationKey: ['auth', 'logout'],
		mutationFn: () => logout()
	});
