export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
	const res = await fetch(`${API_URL}${path}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(options.headers || {}),
		},
	})

	if (!res.ok) {
		let message = 'Coś poszło nie tak'
		try {
			const data = await res.json()
			message = data?.message || message
		} catch {}
		throw new Error(message)
	}

	return res.json()
}
