'use client'

import { use, useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { API_URL, apiFetch } from '../../../../lib/api'
import { useAuth } from '../../../../lib/useAuth'
import { getToken } from '../../../../lib/auth'

type Photo = {
	id: string
	url: string
	status: string
	createdAt: string
}

export default function GalleryPage({ params }: { params: Promise<{ eventId: string }> }) {
	const { eventId } = use(params)
	const { checking } = useAuth()

	const [photos, setPhotos] = useState<Photo[]>([])
	const [loading, setLoading] = useState(true)
	const [eventName, setEventName] = useState('')
	const [selected, setSelected] = useState<Photo | null>(null)
	const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

	const [isDownloading, setIsDownloading] = useState(false)

	const fetchPhotos = useCallback(async () => {
		try {
			const token = getToken()
			const res = await fetch(`${API_URL}/photos/${eventId}`, {
				headers: token ? { Authorization: `Bearer ${token}` } : {},
			})
			if (!res.ok) return
			const data: Photo[] = await res.json()
			setPhotos(data)
			setLoading(false)

			// If any photos are still pending, keep polling
			const hasPending = data.some(p => p.status === 'PENDING')
			if (!hasPending && pollRef.current) {
				clearInterval(pollRef.current)
				pollRef.current = null
			}
		} catch {}
	}, [eventId])

	const fetchEventName = useCallback(async () => {
		try {
			const token = getToken()
			const res = await fetch(`${API_URL}/events/${eventId}`, {
				headers: token ? { Authorization: `Bearer ${token}` } : {},
			})
			if (!res.ok) return
			const data = await res.json()
			setEventName(data.name)
		} catch {}
	}, [eventId])

	useEffect(() => {
		if (checking) return
		fetchEventName()
		fetchPhotos()

		// Start polling every 3s (stops itself when no PENDING)
		pollRef.current = setInterval(fetchPhotos, 3000)
		return () => {
			if (pollRef.current) clearInterval(pollRef.current)
		}
	}, [checking, fetchPhotos, fetchEventName])

	const handleDownloadZip = async () => {
		if (isDownloading) return
		setIsDownloading(true)
		try {
			interface ZipResponse {
				url: string
			}
			const data = await apiFetch<ZipResponse>(`/events/${eventId}/download-zip`)

			if (data && data.url) {
				const a = document.createElement('a')
				a.href = data.url
				a.target = '_blank' // Otwiera w nowej karcie na wypadek restrykcji mobilnych
				document.body.appendChild(a)
				a.click()
				document.body.removeChild(a)
			} else {
				alert('Serwer nie zwrócił poprawnego linku do paczki ZIP.')
			}
		} catch (err) {
			console.error('Błąd pobierania ZIP:', err)
			// apiFetch automatycznie wyciągnie komunikat błędu wysłany z NestJS (np. "Wydarzenie nie istnieje")
			alert(err instanceof Error ? err.message : 'Wystąpił błąd podczas generowania paczki ZIP.')
		} finally {
			setIsDownloading(false)
		}
	}

	const done = photos.filter(p => p.status !== 'PENDING' && p.status !== 'FAILED')
	const pending = photos.filter(p => p.status === 'PENDING')
	const failed = photos.filter(p => p.status === 'FAILED')

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
				<div className='fade-up' style={{ marginBottom: 36 }}>
					<Link
						href='/dashboard'
						style={{
							fontSize: '0.85rem',
							color: 'var(--muted)',
							display: 'inline-flex',
							alignItems: 'center',
							gap: 6,
							marginBottom: 20,
						}}>
						← Wróć do panelu
					</Link>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'flex-end',
							flexWrap: 'wrap',
							gap: 16,
						}}>
						<div>
							<p
								style={{
									fontSize: '0.75rem',
									textTransform: 'uppercase',
									letterSpacing: '0.1em',
									color: 'var(--gold)',
									marginBottom: 8,
								}}>
								Galeria
							</p>
							<h1
								style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700 }}>
								{eventName || eventId}
							</h1>
						</div>

						<div style={{ display: 'flex', gap: 10 }}>
							<button
								onClick={handleDownloadZip}
								disabled={isDownloading}
								className='btn-primary' // Zmieniłem na btn-primary, żeby wyróżniał się jako główna akcja (pobranie zdjęć)
								style={{ fontSize: '0.85rem', cursor: isDownloading ? 'not-allowed' : 'pointer' }}>
								{isDownloading ? 'Generowanie ZIP...' : '📦 Pobierz ZIP'}
							</button>
							<Link href={`/dashboard/events/${eventId}/qr`} className='btn-secondary' style={{ fontSize: '0.85rem' }}>
								QR Code
							</Link>
							<Link href={`/e/${eventId}`} className='btn-secondary' style={{ fontSize: '0.85rem' }} target='_blank'>
								↗ Strona gości
							</Link>
						</div>
					</div>
				</div>

				{/* Stats */}
				{!loading && (
					<div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
						<span className='tag' style={{ color: 'var(--white)', borderColor: 'var(--border-md)' }}>
							{done.length} zdjęć
						</span>
						{pending.length > 0 && (
							<span className='tag' style={{ color: 'var(--gold)', borderColor: 'rgba(201,169,110,0.3)' }}>
								<span className='spinner' style={{ width: 10, height: 10 }} />
								{pending.length} w kolejce
							</span>
						)}
						{failed.length > 0 && (
							<span className='tag' style={{ color: 'var(--red)', borderColor: 'rgba(224,112,112,0.3)' }}>
								{failed.length} błędów
							</span>
						)}
					</div>
				)}

				{/* Grid */}
				{loading ? (
					<div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
						<span className='spinner' style={{ width: 32, height: 32 }} />
					</div>
				) : photos.length === 0 ? (
					<div className='card' style={{ padding: '80px 40px', textAlign: 'center' }}>
						<p
							style={{
								fontFamily: 'var(--font-display)',
								fontSize: '1.3rem',
								color: 'var(--muted)',
								marginBottom: 12,
							}}>
							Brak zdjęć
						</p>
						<p style={{ fontSize: '0.875rem', color: 'var(--muted-2)' }}>
							Gdy goście zaczną wrzucać zdjęcia, pojawią się tutaj.
						</p>
					</div>
				) : (
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
							gap: 12,
						}}>
						{photos.map((photo, i) => (
							<div
								key={photo.id}
								onClick={() => photo.status === 'DONE' && setSelected(photo)}
								className='fade-in'
								style={{
									position: 'relative',
									aspectRatio: '4/3',
									borderRadius: 'var(--radius)',
									overflow: 'hidden',
									border: '1px solid var(--border)',
									cursor: photo.status === 'DONE' ? 'pointer' : 'default',
									animationDelay: `${Math.min(i * 0.04, 0.4)}s`,
									background: 'var(--bg-card)',
								}}>
								{photo.status === 'DONE' && photo.url ? (
									<img
										src={photo.url}
										alt='Zdjęcie z wesela'
										style={{
											width: '100%',
											height: '100%',
											objectFit: 'cover',
											display: 'block',
											transition: 'transform 0.3s',
										}}
										onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
										onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
									/>
								) : photo.status === 'PENDING' ? (
									<div
										style={{
											width: '100%',
											height: '100%',
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
											justifyContent: 'center',
											gap: 10,
										}}>
										<span className='spinner' style={{ width: 24, height: 24 }} />
										<p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Przetwarzanie…</p>
									</div>
								) : (
									<div
										style={{
											width: '100%',
											height: '100%',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}>
										<p style={{ fontSize: '0.75rem', color: 'var(--red)' }}>Błąd</p>
									</div>
								)}

								{/* Timestamp overlay */}
								{photo.status === 'DONE' && (
									<div
										style={{
											position: 'absolute',
											bottom: 0,
											left: 0,
											right: 0,
											padding: '20px 12px 10px',
											background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
											fontSize: '0.7rem',
											color: 'rgba(255,255,255,0.6)',
										}}>
										{new Date(photo.createdAt).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>

			{/* Lightbox */}
			{selected && (
				<div
					onClick={() => setSelected(null)}
					style={{
						position: 'fixed',
						inset: 0,
						background: 'rgba(0,0,0,0.92)',
						zIndex: 200,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						padding: 24,
						cursor: 'zoom-out',
					}}>
					<img
						src={selected.url}
						alt='Podgląd'
						style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: 'var(--radius)', objectFit: 'contain' }}
					/>
					<button
						onClick={() => setSelected(null)}
						style={{
							position: 'absolute',
							top: 20,
							right: 20,
							background: 'rgba(255,255,255,0.1)',
							border: '1px solid var(--border-md)',
							color: 'var(--white)',
							borderRadius: '50%',
							width: 40,
							height: 40,
							cursor: 'pointer',
							fontSize: '1.1rem',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
						×
					</button>
				</div>
			)}
		</main>
	)
}
