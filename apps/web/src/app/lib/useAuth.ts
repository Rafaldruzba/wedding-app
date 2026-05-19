'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { parseTokenPayload, TokenPayload } from './auth'

export function useAuth() {
	const router = useRouter()
	const [user, setUser] = useState<TokenPayload | null>(null)
	const [checking, setChecking] = useState(true)

	useEffect(() => {
		const payload = parseTokenPayload()
		if (!payload) {
			router.replace('/login')
		} else {
			setUser(payload)
		}
		setChecking(false)
	}, [router])

	return { user, checking }
}
