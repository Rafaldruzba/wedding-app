'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getToken, removeToken, parseTokenPayload } from '../lib/auth'

// Pages where the navbar should be hidden (public camera page for guests)
const HIDDEN_ON = ['/e/']

export function NavBar() {
	const pathname = usePathname()
	const router = useRouter()
	const [user, setUser] = useState<{ name?: string; email?: string } | null>(null)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		const payload = parseTokenPayload()
		if (payload) setUser({ name: payload.name, email: payload.email })
	}, [pathname]) // re-check on every navigation

	const logout = () => {
		removeToken()
		setUser(null)
		router.push('/')
	}

	// Hide on guest camera pages
	if (HIDDEN_ON.some(p => pathname.startsWith(p))) return null

	return (
		<header
			style={{
				position: 'sticky',
				top: 0,
				zIndex: 100,
				borderBottom: '1px solid var(--border)',
				background: 'rgba(12,11,9,0.85)',
				backdropFilter: 'blur(20px)',
				WebkitBackdropFilter: 'blur(20px)',
			}}>
			<div
				style={{
					maxWidth: 1200,
					margin: '0 auto',
					padding: '0 24px',
					height: 60,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 16,
				}}>
				{/* Logo */}
				<Link href='/' style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
					<span
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: '1.2rem',
							fontWeight: 600,
							color: 'var(--gold)',
							letterSpacing: '0.01em',
						}}>
						WeddingSnap
					</span>
				</Link>

				{/* Right side */}
				{mounted && (
					<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
						{user ? (
							<>
								<Link
									href='/dashboard'
									style={{
										fontSize: '0.875rem',
										color: 'var(--muted)',
										transition: 'color 0.2s',
										fontWeight: 400,
									}}
									onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
									onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
									Panel
								</Link>

								{/* Avatar */}
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: 10,
										padding: '6px 14px 6px 8px',
										border: '1px solid var(--border)',
										borderRadius: 100,
										cursor: 'pointer',
										background: 'var(--bg-card)',
										transition: 'border-color 0.2s',
									}}>
									<div
										style={{
											width: 28,
											height: 28,
											borderRadius: '50%',
											background: 'var(--gold-dim)',
											border: '1px solid var(--gold)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontSize: '0.7rem',
											fontWeight: 600,
											color: 'var(--gold)',
											flexShrink: 0,
										}}>
										{(user.name || user.email || '?').charAt(0).toUpperCase()}
									</div>
									<span
										style={{
											fontSize: '0.85rem',
											color: 'var(--white)',
											maxWidth: 120,
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap',
										}}>
										{user.name || user.email}
									</span>
								</div>

								<button onClick={logout} className='btn-secondary' style={{ padding: '7px 18px', fontSize: '0.82rem' }}>
									Wyloguj
								</button>
							</>
						) : (
							<>
								<Link href='/login' className='btn-secondary' style={{ padding: '7px 18px', fontSize: '0.85rem' }}>
									Zaloguj
								</Link>
								<Link href='/register' className='btn-primary' style={{ padding: '7px 18px', fontSize: '0.85rem' }}>
									Załóż konto
								</Link>
							</>
						)}
					</div>
				)}
			</div>
		</header>
	)
}
