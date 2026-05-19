'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'
import { useAuth } from '../lib/useAuth'

type EventType = {
	id: string
	name: string
	slug: string
	date: string | null
	photos: { id: string; status?: string }[]
	createdAt: string
}

export default function DashboardPage() {
	const { user, checking } = useAuth()
	const [events, setEvents] = useState<EventType[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		if (!checking && user) fetchEvents()
	}, [checking, user])

	const fetchEvents = async () => {
		try {
			setLoading(true)
			const data = await apiFetch<EventType[]>('/events', { method: 'GET' }, true)
			setEvents(data)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Błąd pobierania wydarzeń')
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
			<div style={{ maxWidth: 1200, margin: '0 auto' }}>
				{/* Header */}
				<div className='fade-up' style={{ marginBottom: 40 }}>
					<p
						style={{
							fontSize: '0.75rem',
							textTransform: 'uppercase',
							letterSpacing: '0.1em',
							color: 'var(--gold)',
							marginBottom: 10,
						}}>
						Panel pary młodej
					</p>
					<div
						style={{
							display: 'flex',
							alignItems: 'flex-end',
							justifyContent: 'space-between',
							flexWrap: 'wrap',
							gap: 20,
						}}>
						<h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700 }}>
							Witaj{user?.name ? `, ${user.name.split(' ')[0]}` : ''} ✦
						</h1>
						<div style={{ display: 'flex', gap: 10 }}>
							<button onClick={fetchEvents} className='btn-secondary' style={{ fontSize: '0.85rem' }}>
								Odśwież
							</button>
							<Link href='/dashboard/events/create' className='btn-primary' style={{ fontSize: '0.85rem' }}>
								+ Nowe wydarzenie
							</Link>
						</div>
					</div>
				</div>

				{/* Stats bar */}
				{!loading && events.length > 0 && (
					<div
						className='card-sm fade-up'
						style={{
							display: 'flex',
							gap: 0,
							marginBottom: 32,
							overflow: 'hidden',
						}}>
						{[
							{ label: 'Wydarzeń', value: events.length },
							{ label: 'Zdjęć łącznie', value: events.reduce((s, e) => s + (e.photos?.length || 0), 0) },
							{ label: 'Aktywnych', value: events.length },
						].map((stat, i) => (
							<div
								key={stat.label}
								style={{
									flex: 1,
									padding: '20px 24px',
									borderRight: i < 2 ? '1px solid var(--border)' : 'none',
								}}>
								<p
									style={{
										fontSize: '1.6rem',
										fontFamily: 'var(--font-display)',
										fontWeight: 600,
										color: 'var(--gold)',
									}}>
									{stat.value}
								</p>
								<p
									style={{
										fontSize: '0.78rem',
										color: 'var(--muted)',
										textTransform: 'uppercase',
										letterSpacing: '0.06em',
										marginTop: 4,
									}}>
									{stat.label}
								</p>
							</div>
						))}
					</div>
				)}

				{/* Content */}
				{loading ? (
					<div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
						<span className='spinner' style={{ width: 32, height: 32 }} />
					</div>
				) : error ? (
					<p className='error-box'>{error}</p>
				) : events.length === 0 ? (
					<div className='card' style={{ padding: '80px 40px', textAlign: 'center' }}>
						<p
							style={{
								fontFamily: 'var(--font-display)',
								fontSize: '1.4rem',
								color: 'var(--muted)',
								marginBottom: 20,
							}}>
							Nie masz jeszcze żadnego wydarzenia
						</p>
						<Link href='/dashboard/events/create' className='btn-primary'>
							Stwórz pierwsze wydarzenie
						</Link>
					</div>
				) : (
					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
						{events.map((event, i) => {
							const done = event.photos?.filter(p => !p.status || p.status === 'DONE').length || 0
							const pending = event.photos?.filter(p => p.status === 'PENDING').length || 0

							return (
								<div
									key={event.id}
									className='card fade-up'
									style={{
										padding: 24,
										animationDelay: `${i * 0.06}s`,
										display: 'flex',
										flexDirection: 'column',
										gap: 0,
									}}>
									{/* Top row */}
									<div
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'flex-start',
											marginBottom: 16,
										}}>
										<div>
											<h2
												style={{
													fontFamily: 'var(--font-display)',
													fontSize: '1.15rem',
													fontWeight: 600,
													marginBottom: 4,
												}}>
												{event.name}
											</h2>
											<p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
												{event.date
													? new Date(event.date).toLocaleDateString('pl-PL', {
															day: 'numeric',
															month: 'long',
															year: 'numeric',
														})
													: 'Brak daty'}
											</p>
										</div>
										<span
											className='tag'
											style={{ color: 'var(--green)', borderColor: 'rgba(126,200,154,0.25)', fontSize: '0.7rem' }}>
											● aktywne
										</span>
									</div>

									{/* Meta */}
									<div
										style={{
											display: 'flex',
											gap: 12,
											padding: '12px 0',
											borderTop: '1px solid var(--border)',
											borderBottom: '1px solid var(--border)',
											marginBottom: 20,
										}}>
										<div style={{ flex: 1, textAlign: 'center' }}>
											<p
												style={{
													fontSize: '1.3rem',
													fontFamily: 'var(--font-display)',
													fontWeight: 600,
													color: 'var(--white)',
												}}>
												{done}
											</p>
											<p
												style={{
													fontSize: '0.72rem',
													color: 'var(--muted)',
													textTransform: 'uppercase',
													letterSpacing: '0.05em',
												}}>
												Zdjęcia
											</p>
										</div>
										{pending > 0 && (
											<div style={{ flex: 1, textAlign: 'center' }}>
												<p
													style={{
														fontSize: '1.3rem',
														fontFamily: 'var(--font-display)',
														fontWeight: 600,
														color: 'var(--gold)',
													}}>
													{pending}
												</p>
												<p
													style={{
														fontSize: '0.72rem',
														color: 'var(--muted)',
														textTransform: 'uppercase',
														letterSpacing: '0.05em',
													}}>
													W kolejce
												</p>
											</div>
										)}
										<div style={{ flex: 1, textAlign: 'center' }}>
											<p
												style={{
													fontSize: '0.85rem',
													fontFamily: 'var(--font-display)',
													fontWeight: 500,
													color: 'var(--muted)',
													wordBreak: 'break-all',
												}}>
												{event.slug}
											</p>
											<p
												style={{
													fontSize: '0.72rem',
													color: 'var(--muted-2)',
													textTransform: 'uppercase',
													letterSpacing: '0.05em',
												}}>
												Slug
											</p>
										</div>
									</div>

									{/* Actions */}
									<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
										<Link
											href={`/dashboard/events/${event.id}/gallery`}
											className='btn-primary'
											style={{ fontSize: '0.82rem', padding: '9px 18px', flex: 1, justifyContent: 'center' }}>
											Galeria
										</Link>
										<Link
											href={`/dashboard/events/${event.id}/qr`}
											className='btn-secondary'
											style={{ fontSize: '0.82rem', padding: '9px 18px' }}>
											QR
										</Link>
										<Link
											href={`/e/${event.id}`}
											className='btn-secondary'
											style={{ fontSize: '0.82rem', padding: '9px 18px' }}
											target='_blank'>
											↗ Link
										</Link>
									</div>
								</div>
							)
						})}
					</div>
				)}
			</div>
		</main>
	)
}
