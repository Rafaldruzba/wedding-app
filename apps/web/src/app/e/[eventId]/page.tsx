'use client'

import { useEffect, useRef, useState, use } from 'react'
import { API_URL } from './../../lib/api'

export default function EventCameraPage({ params }: { params: Promise<{ eventId: string }> }) {
	const { eventId } = use(params)
	const videoRef = useRef<HTMLVideoElement | null>(null)
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const streamRef = useRef<MediaStream | null>(null)

	const [ready, setReady] = useState(false)
	const [preview, setPreview] = useState<string | null>(null)
	const [uploading, setUploading] = useState(false)
	const [uploaded, setUploaded] = useState(false)
	const [error, setError] = useState('')

	useEffect(() => {
		const startCamera = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: { facingMode: 'environment' },
					audio: false,
				})

				streamRef.current = stream

				if (videoRef.current) {
					videoRef.current.srcObject = stream
					await videoRef.current.play()
					setReady(true)
				}
			} catch {
				setError('Nie udało się uruchomić aparatu. Sprawdź uprawnienia.')
			}
		}

		startCamera()

		return () => {
			streamRef.current?.getTracks().forEach(track => track.stop())
		}
	}, [])

	const capturePhoto = async () => {
		setError('')
		setUploaded(false)

		const video = videoRef.current
		const canvas = canvasRef.current

		if (!video || !canvas) return

		canvas.width = video.videoWidth
		canvas.height = video.videoHeight

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

		const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
		setPreview(dataUrl)

		const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(b => resolve(b), 'image/jpeg', 0.92))

		if (!blob) {
			setError('Nie udało się przygotować zdjęcia.')
			return
		}

		setUploading(true)

		try {
			const formData = new FormData()
			formData.append('photo', blob, `wedding-${Date.now()}.jpg`)
			formData.append('eventId', eventId)

			const res = await fetch(`${API_URL}/photos/${eventId}/upload`, {
				method: 'POST',
				body: formData,
			})

			if (!res.ok) {
				throw new Error('Upload nie powiódł się')
			}

			setUploaded(true)
		} catch {
			setError('Upload się nie udał. Spróbuj jeszcze raz.')
		} finally {
			setUploading(false)
		}
	}

	const resetPreview = () => {
		setPreview(null)
		setUploaded(false)
		setError('')
	}

	return (
		<main className='min-h-screen bg-black text-white'>
			<div className='mx-auto flex min-h-screen max-w-md flex-col px-4 py-4'>
				<div className='mb-4 rounded-2xl border border-white/10 bg-white/5 p-4'>
					<p className='text-xs text-white/50'>Wydarzenie</p>
					<h1 className='text-xl font-semibold'>Skan QR i rób zdjęcie</h1>
					<p className='mt-1 text-sm text-white/60'>Publiczny upload dla eventu: {eventId}</p>
				</div>

				<div className='relative flex-1 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5'>
					{!preview ? (
						<>
							<video ref={videoRef} playsInline autoPlay muted className='h-full w-full object-cover' />
							<div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20' />
							<div className='absolute left-0 right-0 top-0 p-4 text-center'>
								<span className='rounded-full bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur'>
									aparat aktywny
								</span>
							</div>
						</>
					) : (
						<img src={preview} alt='Podgląd zdjęcia' className='h-full w-full object-cover' />
					)}
				</div>

				<canvas ref={canvasRef} className='hidden' />

				<div className='mt-4 space-y-3'>
					{error ? (
						<div className='rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200'>{error}</div>
					) : null}

					{uploaded ? (
						<div className='rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200'>
							Zdjęcie wysłane. Możesz zrobić kolejne.
						</div>
					) : null}

					<div className='grid grid-cols-2 gap-3'>
						<button
							onClick={preview ? resetPreview : capturePhoto}
							disabled={!ready || uploading}
							className='rounded-2xl border border-white/10 bg-white/5 px-4 py-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50'>
							{preview ? 'Zrób ponownie' : 'Zrób zdjęcie'}
						</button>

						<button
							onClick={capturePhoto}
							disabled={!ready || uploading}
							className='rounded-2xl bg-white px-4 py-4 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50'>
							{uploading ? 'Wysyłanie...' : 'Wyślij'}
						</button>
					</div>
				</div>
			</div>
		</main>
	)
}
