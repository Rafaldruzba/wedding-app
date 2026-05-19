const TOKEN_KEY = 'ws_token'

export interface TokenPayload {
	sub: string
	email: string
	name: string
	exp: number
	iat: number
}

export interface TokenPayload {
	sub: string
	email: string
	name: string
	exp: number
	iat: number
}

export function setToken(token: string) {
	if (typeof window !== 'undefined') {
		localStorage.setItem(TOKEN_KEY, token)
	}
}

export function getToken(): string | null {
	if (typeof window === 'undefined') return null
	return localStorage.getItem(TOKEN_KEY)
}

export function removeToken() {
	if (typeof window !== 'undefined') {
		localStorage.removeItem(TOKEN_KEY)
	}
}

export function parseTokenPayload(): TokenPayload | null {
	try {
		const token = getToken()
		if (!token) return null

		const base64 = token.split('.')[1]
		if (!base64) return null

		const payload: TokenPayload = JSON.parse(atob(base64))

		// Check expiry
		if (payload.exp && Date.now() / 1000 > payload.exp) {
			removeToken()
			return null
		}

		return payload
	} catch {
		return null
	}
}

export function isLoggedIn(): boolean {
	return parseTokenPayload() !== null
}
