/** Only allow same-origin relative paths, to prevent open redirects via `?redirectTo=`. */
export function safeRedirect(target: string | null | undefined, fallback = '/') {
	if (!target || !target.startsWith('/') || target.startsWith('//') || target.startsWith('/\\')) {
		return fallback;
	}
	return target;
}
