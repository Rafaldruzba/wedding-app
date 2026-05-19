'use client'

import { use, useCallback, useEffect, useRef, useState } from 'react'
import { API_URL } from '../../lib/api'

type Step = 'camera' | 'preview' | 'uploading' | 'success' | 'error_camera'

export default function GuestCameraPage({ params }: { params: Promise<{ eventId: string }> }) {
	const { eventId } = use(params)

	const videoRef = useRef<HTMLVideoElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const streamRef = useRef<MediaStream | null>(null)

	const [step, setStep] = useState<Step>('camera')
	const [preview, setPreview] = useState<string | null>(null)
	const [uploadError, setUploadError] = useState('')
	const [count, setCount] = useState(0) // photos sent this session

	// Start camera
	const startCamera = useCallback(async () => {
		try {
			// Stop existing stream first
			streamRef.current?.getTracks().forEach(t => t.stop())

			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: { ideal: 'environment' }, // rear camera on phones
					width: { ideal: 1920 },
					height: { ideal: 1080 },
				},
				audio: false,
			})

			streamRef.current = stream

			if (videoRef.current) {
				videoRef.current.srcObject = stream
				await videoRef.current.play()
			}

			setStep('camera')
		} catch {
			setStep('error_camera')
		}
	}, [])

	useEffect(() => {
		startCamera()
		return () => {
			streamRef.current?.getTracks().forEach(t => t.stop())
		}
	}, [startCamera])

	const capture = () => {
		const video = videoRef.current
		const canvas = canvasRef.current
		if (!video || !canvas) return

		canvas.width = video.videoWidth
		canvas.height = video.videoHeight
		canvas.getContext('2d')?.drawImage(video, 0, 0)

		setPreview(canvas.toDataURL('image/jpeg', 0.92))
		setStep('preview')
	}

	const retake = () => {
		setPreview(null)
		setStep('camera')
	}

	const upload = async () => {
		if (!canvasRef.current) return
		setStep('uploading')
		setUploadError('')

		try {
			const blob = await new Promise<Blob | null>(resolve =>
				canvasRef.current!.toBlob(b => resolve(b), 'image/jpeg', 0.92),
			)
			if (!blob) throw new Error('Nie udało się przygotować zdjęcia')

			const formData = new FormData()
			formData.append('photo', blob, `wedding-${Date.now()}.jpg`)

			const res = await fetch(`${API_URL}/photos/${eventId}/upload`, {
				method: 'POST',
				body: formData,
			})

			if (!res.ok) throw new Error('Upload nie powiódł się')

			setCount(c => c + 1)
			setStep('success')
		} catch (err) {
			setUploadError(err instanceof Error ? err.message : 'Błąd uploadu')
			setStep('preview') // stay on preview so user can retry
		}
	}

	const another = () => {
		setPreview(null)
		setStep('camera')
	}

	return (
		<div
			style={{
				position: 'fixed',
				inset: 0,
				background: '#000',
				overflow: 'hidden',
				fontFamily: 'var(--font-body)',
				color: '#fff',
				display: 'flex',
				flexDirection: 'column',
			}}>
			{/* Camera error */}
			{step === 'error_camera' && (
				<div
					style={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						padding: 32,
						textAlign: 'center',
						gap: 20,
					}}>
					<p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>Brak dostępu do kamery</p>
					<p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', maxWidth: 280 }}>
						Zezwól na dostęp do aparatu w ustawieniach przeglądarki i spróbuj ponownie.
					</p>
					<button onClick={startCamera} className='btn-primary'>
						Spróbuj ponownie
					</button>
				</div>
			)}

			{/* Video / Preview */}
			{step !== 'error_camera' && (
				<div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
					{/* Live video */}
					<video
						ref={videoRef}
						playsInline
						autoPlay
						muted
						style={{
							position: 'absolute',
							inset: 0,
							width: '100%',
							height: '100%',
							objectFit: 'cover',
							display: step === 'camera' ? 'block' : 'none',
						}}
					/>

					{/* Preview image */}
					{preview && (step === 'preview' || step === 'uploading' || step === 'success') && (
						<img
							src={preview}
							alt='Podgląd'
							style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
						/>
					)}

					{/* Top bar */}
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							padding: '16px 20px',
							background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}>
						<p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600 }}>WeddingSnap</p>
						{count > 0 && (
							<span
								style={{
									background: 'rgba(201,169,110,0.2)',
									border: '1px solid rgba(201,169,110,0.4)',
									color: 'var(--gold)',
									fontSize: '0.75rem',
									padding: '4px 12px',
									borderRadius: 100,
								}}>
								{count} {count === 1 ? 'zdjęcie' : 'zdjęcia'} wysłane
							</span>
						)}
					</div>

					{/* Success overlay */}
					{step === 'success' && (
						<div
							style={{
								position: 'absolute',
								inset: 0,
								background: 'rgba(0,0,0,0.5)',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 12,
							}}>
							<div
								style={{
									width: 64,
									height: 64,
									borderRadius: '50%',
									background: 'var(--green-dim)',
									border: '2px solid var(--green)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: '1.8rem',
								}}>
								✓
							</div>
							<p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>Zdjęcie wysłane!</p>
						</div>
					)}

					{/* Uploading overlay */}
					{step === 'uploading' && (
						<div
							style={{
								position: 'absolute',
								inset: 0,
								background: 'rgba(0,0,0,0.5)',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 16,
							}}>
							<span className='spinner' style={{ width: 40, height: 40, borderWidth: 3 }} />
							<p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>Wysyłanie…</p>
						</div>
					)}
				</div>
			)}

			<canvas ref={canvasRef} style={{ display: 'none' }} />

			{/* Bottom controls */}
			{step !== 'error_camera' && (
				<div
					style={{
						padding: '20px 24px 36px',
						background: 'rgba(0,0,0,0.85)',
						backdropFilter: 'blur(20px)',
						display: 'flex',
						flexDirection: 'column',
						gap: 12,
					}}>
					{uploadError && (
						<p className='error-box' style={{ textAlign: 'center' }}>
							{uploadError}
						</p>
					)}

					{step === 'camera' && (
						<div style={{ display: 'flex', justifyContent: 'center' }}>
							{/* Classic shutter button */}
							<button
								onClick={capture}
								style={{
									width: 72,
									height: 72,
									borderRadius: '50%',
									border: '4px solid rgba(255,255,255,0.8)',
									background: 'transparent',
									cursor: 'pointer',
									position: 'relative',
									transition: 'transform 0.1s',
								}}
								onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.93)')}
								onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}>
								<div
									style={{
										position: 'absolute',
										inset: 6,
										borderRadius: '50%',
										background: 'rgba(255,255,255,0.9)',
									}}
								/>
							</button>
						</div>
					)}

					{step === 'preview' && (
						<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
							<button onClick={retake} className='btn-secondary' style={{ fontSize: '0.95rem', padding: '14px' }}>
								Zrób ponownie
							</button>
							<button onClick={upload} className='btn-primary' style={{ fontSize: '0.95rem', padding: '14px' }}>
								Wyślij zdjęcie
							</button>
						</div>
					)}

					{step === 'success' && (
						<button onClick={another} className='btn-primary' style={{ fontSize: '0.95rem', padding: '14px' }}>
							Zrób kolejne zdjęcie
						</button>
					)}
				</div>
			)}
		</div>
	)
}
