import { getToken, removeToken } from './auth'

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function apiFetch<T>(path: string, options: RequestInit = {}, withAuth: boolean = true): Promise<T> {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...((options.headers as Record<string, string>) || {}),
	}

	if (withAuth) {
		const token = getToken()
		if (token) headers['Authorization'] = `Bearer ${token}`
	}

	const res = await fetch(`${API_URL}${path}`, {
		...options,
		headers,
	})

	// Auto-logout on 401
	if (res.status === 401) {
		removeToken()
		if (typeof window !== 'undefined') {
			window.location.href = '/login'
		}
		throw new Error('Sesja wygasła. Zaloguj się ponownie.')
	}

	if (!res.ok) {
		let message = 'Coś poszło nie tak'
		try {
			const data = await res.json()
			message = data?.message || message
		} catch {}
		throw new Error(message)
	}

	// Handle 204 No Content
	if (res.status === 204) return undefined as T

	return res.json()
}

/** Upload form-data (no Content-Type header — browser sets boundary automatically) */
export async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
	const headers: Record<string, string> = {}
	const token = getToken()
	if (token) headers['Authorization'] = `Bearer ${token}`

	const res = await fetch(`${API_URL}${path}`, {
		method: 'POST',
		headers,
		body: formData,
	})

	if (!res.ok) {
		let message = 'Upload nie powiódł się'
		try {
			const data = await res.json()
			message = data?.message || message
		} catch {}
		throw new Error(message)
	}

	return res.json()
}
