'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type EventType = {
	id: string
	name: string
	slug: string
	date: string | null
	photos: {
		id: string
	}[]
	createdAt: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function DashboardPage() {
	const [events, setEvents] = useState<EventType[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		fetchEvents()
	}, [])

	const fetchEvents = async () => {
		try {
			setLoading(true)

			const res = await fetch(`${API_URL}/events`)

			if (!res.ok) {
				throw new Error('Nie udało się pobrać wydarzeń')
			}

			const data = await res.json()

			setEvents(data)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Wystąpił błąd')
		} finally {
			setLoading(false)
		}
	}

	return (
		<main className='min-h-screen px-4 py-6 sm:px-6 lg:px-8'>
			<div className='mx-auto max-w-6xl'>
				<div className='mb-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur'>
					<p className='text-sm text-white/60'>Panel pary młodej</p>

					<h1 className='mt-2 text-3xl font-bold'>Twoje wydarzenia</h1>

					<p className='mt-2 max-w-2xl text-sm leading-6 text-white/70'>
						Tu tworzysz wesele, generujesz QR do druku i oglądasz zdjęcia gości.
					</p>

					<div className='mt-5 flex flex-col gap-3 sm:flex-row'>
						<Link
							href='/dashboard/events/create'
							className='inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 font-semibold text-black transition hover:opacity-90'>
							+ Nowe wydarzenie
						</Link>

						<button
							onClick={fetchEvents}
							className='inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10'>
							Odśwież
						</button>
					</div>
				</div>

				{loading ? (
					<div className='rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center text-white/70'>
						Ładowanie wydarzeń...
					</div>
				) : error ? (
					<div className='rounded-[2rem] border border-red-500/20 bg-red-500/10 p-8 text-center text-red-200'>
						{error}
					</div>
				) : events.length === 0 ? (
					<div className='rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center text-white/70'>
						Brak wydarzeń.
					</div>
				) : (
					<div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
						{events.map(event => (
							<div key={event.id} className='rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur'>
								<div className='flex items-start justify-between gap-3'>
									<div>
										<p className='text-lg font-semibold'>{event.name}</p>

										<p className='mt-1 text-sm text-white/60'>
											{event.date ? new Date(event.date).toLocaleDateString('pl-PL') : 'Brak daty'}
										</p>
									</div>

									<span className='rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300'>aktywne</span>
								</div>

								<div className='mt-4 space-y-2 text-sm text-white/70'>
									<p>Slug: {event.slug}</p>

									<p>
										Zdjęcia: <span className='font-semibold text-white'>{event.photos?.length || 0}</span>
									</p>
								</div>

								<div className='mt-5 flex flex-wrap gap-3'>
									<Link
										href={`/dashboard/events/${event.id}/gallery`}
										className='rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90'>
										Galeria
									</Link>

									<Link
										href={`/dashboard/events/${event.id}/qr`}
										className='rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10'>
										QR Code
									</Link>

									<Link
										href={`/e/${event.id}`}
										className='rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10'>
										Publiczny link
									</Link>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</main>
	)
}
