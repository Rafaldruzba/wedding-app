'use client'

import { use } from 'react'
import QRCode from 'react-qr-code'

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'

export default function EventQRPage({ params }: { params: Promise<{ eventId: string }> }) {
	const { eventId } = use(params)

	const publicUrl = `${FRONTEND_URL}/e/${eventId}`

	return (
		<main className='min-h-screen px-4 py-10'>
			<div className='mx-auto max-w-2xl'>
				<div className='rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center backdrop-blur'>
					<p className='text-sm text-white/60'>Kod QR dla gości</p>

					<h1 className='mt-2 text-3xl font-bold'>Zeskanuj i dodaj zdjęcie 📸</h1>

					<p className='mt-3 text-white/70'>Wydrukuj ten kod i połóż go na stołach.</p>

					<div className='mt-8 flex justify-center rounded-[2rem] bg-white p-6'>
						<QRCode value={publicUrl} size={260} />
					</div>

					<div className='mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/60 break-all'>
						{publicUrl}
					</div>

					<div className='mt-6 flex flex-wrap justify-center gap-3'>
						<button onClick={() => window.print()} className='rounded-2xl bg-white px-5 py-3 font-semibold text-black'>
							Drukuj QR
						</button>

						<button
							onClick={() => {
								navigator.clipboard.writeText(publicUrl)
							}}
							className='rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white'>
							Kopiuj link
						</button>
					</div>
				</div>
			</div>
		</main>
	)
}
