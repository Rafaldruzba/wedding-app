'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { parseTokenPayload, TokenPayload } from './auth'

// Public pages that don't require authentication
const PUBLIC_PAGES = ['/login', '/register', '/']

// Pages that require authentication
const PROTECTED_PAGES = ['/dashboard']

export function useAuth() {
	const router = useRouter()
	const pathname = usePathname()
	const [user, setUser] = useState<TokenPayload | null>(null)
	const [checking, setChecking] = useState(true)

	useEffect(() => {
		const payload = parseTokenPayload()

		// Check if current page is protected
		const isProtectedPage = PROTECTED_PAGES.some(page => pathname.startsWith(page))

		// Check if on login or register page
		const isAuthPage = pathname === '/login' || pathname === '/register'

		if (!payload) {
			// User is not logged in
			if (isProtectedPage) {
				// Redirect to login if trying to access protected page
				router.replace('/login')
			}
		} else {
			// User is logged in
			setUser(payload)
			if (isAuthPage) {
				// Redirect to dashboard if trying to access auth pages while logged in
				router.replace('/dashboard')
			}
		}
		setChecking(false)
	}, [router, pathname])

	return { user, checking }
}
