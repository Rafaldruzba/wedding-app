'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import QRCode from 'react-qr-code'
import { useAuth } from '../../../../lib/useAuth'

const FRONTEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export default function EventQRPage({ params }: { params: Promise<{ eventId: string }> }) {
	const { eventId } = use(params)
	const { checking } = useAuth()
	const [copied, setCopied] = useState(false)

	const publicUrl = `${FRONTEND_URL}/e/${eventId}`

	const copy = async () => {
		await navigator.clipboard.writeText(publicUrl)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
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
			<div style={{ maxWidth: 520, margin: '0 auto' }}>
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

				<div className='card fade-up' style={{ padding: '40px 36px', textAlign: 'center' }}>
					<p
						style={{
							fontSize: '1rem',
							textTransform: 'uppercase',
							letterSpacing: '0.1em',
							color: 'var(--gold)',
							marginBottom: 12,
						}}>
						Kod QR dla gości
					</p>
					<h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>
						Zeskanuj i dodaj zdjęcie
					</h1>
					<p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: 36 }}>
						Wydrukuj i połóż na stołach weselnych.
					</p>

					{/* QR */}
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							padding: 28,
							background: '#fff',
							borderRadius: 'var(--radius)',
							marginBottom: 24,
						}}>
						<QRCode value={publicUrl} size={240} />
					</div>

					{/* URL */}
					<div
						style={{
							padding: '12px 16px',
							borderRadius: 'var(--radius-sm)',
							background: 'var(--bg)',
							border: '1px solid var(--border)',
							fontSize: '0.8rem',
							color: 'var(--muted)',
							fontFamily: 'monospace',
							wordBreak: 'break-all',
							marginBottom: 24,
							textAlign: 'left',
						}}>
						{publicUrl}
					</div>

					{/* Actions */}
					<div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
						<button onClick={() => window.print()} className='btn-primary'>
							Drukuj QR
						</button>
						<button onClick={copy} className='btn-secondary'>
							{copied ? '✓ Skopiowano' : 'Kopiuj link'}
						</button>
					</div>
				</div>

				{/* Print styles */}
				<style>{`
          @media print {
            header, a[href] { display: none !important; }
            body { background: white !important; }
          }
        `}</style>
			</div>
		</main>
	)
}
