'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { apiFetch } from '../../../lib/api'
import { useAuth } from '../../../lib/useAuth'
import Link from 'next/link'

function slugify(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '')
		.replace(/-+/g, '-')
}

export default function CreateEventPage() {
	const { checking } = useAuth()
	const router = useRouter()
	const [name, setName] = useState('')
	const [date, setDate] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const suggestedSlug = useMemo(() => {
		if (!name) return ''
		return `${slugify(name)}-${date ? date.slice(0, 4) : new Date().getFullYear()}`
	}, [name, date])

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError('')

		try {
			const data = await apiFetch<{ id: string; slug: string }>('/events', {
				method: 'POST',
				body: JSON.stringify({ name, date, slug: suggestedSlug }),
			})
			router.push(`/dashboard/events/${data.id}/gallery`)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Błąd tworzenia wydarzenia')
		} finally {
			setLoading(false)
		}
	}

	if (checking) {
		return (
			<main
				style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<span className='spinner' style={{ width: 32, height: 32 }} />
			</main>
		)
	}

	return (
		<main style={{ minHeight: 'calc(100vh - 60px)', padding: '40px 24px 80px' }}>
			<div style={{ maxWidth: 560, margin: '0 auto' }}>
				{/* Back */}
				<Link
					href='/dashboard'
					style={{
						fontSize: '0.85rem',
						color: 'var(--muted)',
						display: 'inline-flex',
						alignItems: 'center',
						gap: 6,
						marginBottom: 32,
					}}>
					← Wróć do panelu
				</Link>

				<div className='card fade-up' style={{ padding: '40px 36px' }}>
					<p
						style={{
							fontSize: '0.75rem',
							textTransform: 'uppercase',
							letterSpacing: '0.1em',
							color: 'var(--gold)',
							marginBottom: 12,
						}}>
						Nowe wydarzenie
					</p>
					<h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>
						Utwórz wesele
					</h1>
					<p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: 36 }}>
						Po utworzeniu dostaniesz publiczny link i QR do wydruku.
					</p>

					<form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
						<div>
							<label className='label'>Nazwa wydarzenia</label>
							<input
								className='input'
								placeholder='Ania i Paweł'
								value={name}
								onChange={e => setName(e.target.value)}
								required
							/>
						</div>

						<div>
							<label className='label'>Data (opcjonalna)</label>
							<input className='input' type='date' value={date} onChange={e => setDate(e.target.value)} />
						</div>

						{/* Slug preview */}
						<div
							style={{
								padding: '16px',
								borderRadius: 'var(--radius-sm)',
								background: 'var(--gold-glow)',
								border: '1px solid rgba(201,169,110,0.2)',
							}}>
							<p
								style={{
									fontSize: '0.75rem',
									color: 'var(--gold)',
									textTransform: 'uppercase',
									letterSpacing: '0.06em',
									marginBottom: 6,
								}}>
								Sugestia sluga
							</p>
							<p style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--white)' }}>
								{suggestedSlug || <span style={{ color: 'var(--muted-2)' }}>wpisz nazwę wydarzenia</span>}
							</p>
						</div>

						{error && <p className='error-box'>{error}</p>}

						<button
							type='submit'
							disabled={loading || !name}
							className='btn-primary'
							style={{ marginTop: 4, padding: '14px', fontSize: '0.95rem', borderRadius: 'var(--radius-sm)' }}>
							{loading ? (
								<>
									<span className='spinner' style={{ width: 16, height: 16 }} /> Tworzenie…
								</>
							) : (
								'Utwórz wydarzenie'
							)}
						</button>
					</form>
				</div>
			</div>
		</main>
	)
}
