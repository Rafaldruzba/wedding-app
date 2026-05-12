'use client'

import { useEffect, useState, use } from 'react'
import { API_URL } from './../../../../lib/api'

type Photo = {
	id: string
	url: string
	createdAt?: string
}

export default function GalleryPage({ params }: { params: Promise<{ eventId: string }> }) {
	const { eventId } = use(params)
	const [photos, setPhotos] = useState<Photo[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const loadPhotos = async () => {
			try {
				const res = await fetch(`${API_URL}/photos/${eventId}`)
				if (!res.ok) throw new Error('Nie udało się pobrać zdjęć')
				const data = await res.json()
				setPhotos(data)
			} catch {
				setPhotos([])
			} finally {
				setLoading(false)
			}
		}

		loadPhotos()
	}, [eventId])

	return (
		<main className='min-h-screen px-4 py-6 sm:px-6 lg:px-8'>
			<div className='mx-auto max-w-6xl'>
				<div className='mb-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur'>
					<p className='text-sm text-white/60'>Galeria wydarzenia</p>
					<h1 className='mt-1 text-3xl font-bold'>{eventId}</h1>
					<p className='mt-2 text-sm text-white/70'>Tu będzie widok wszystkich zdjęć wrzuconych przez gości.</p>
				</div>

				{loading ? (
					<div className='rounded-[1.75rem] border border-white/10 bg-white/5 p-8 text-center text-white/70'>
						Ładowanie zdjęć...
					</div>
				) : photos.length === 0 ? (
					<div className='rounded-[1.75rem] border border-white/10 bg-white/5 p-8 text-center text-white/70'>
						Brak zdjęć. Gdy goście zaczną wrzucać, pojawią się tutaj.
					</div>
				) : (
					<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
						{photos.map(photo => (
							<div key={photo.id} className='overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5'>
								<img src={photo.url} alt='Zdjęcie z wesela' className='h-72 w-full object-cover' />
							</div>
						))}
					</div>
				)}
			</div>
		</main>
	)
}
