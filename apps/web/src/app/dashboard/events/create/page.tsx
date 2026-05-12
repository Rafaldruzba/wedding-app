'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { apiFetch } from './../../../lib/api'

function slugify(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9\-]/g, '')
		.replace(/\-+/g, '-')
}

export default function CreateEventPage() {
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
				body: JSON.stringify({
					name,
					date,
					slug: suggestedSlug,
				}),
			})

			router.push(`/dashboard/events/${data.id}/gallery`)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Błąd tworzenia wydarzenia')
		} finally {
			setLoading(false)
		}
	}

	return (
		<main className='min-h-screen px-4 py-6 sm:px-6 lg:px-8'>
			<div className='mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur'>
				<p className='text-sm text-white/60'>Nowe wydarzenie</p>
				<h1 className='mt-2 text-3xl font-bold'>Utwórz wesele</h1>
				<p className='mt-2 text-sm leading-6 text-white/70'>Po utworzeniu dostaniesz publiczny link i QR do wydruku.</p>

				<form className='mt-6 space-y-4' onSubmit={onSubmit}>
					<div className='space-y-2'>
						<label className='text-sm text-white/70'>Nazwa wydarzenia</label>
						<input
							className='w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none placeholder:text-white/30'
							placeholder='Ania i Paweł'
							value={name}
							onChange={e => setName(e.target.value)}
						/>
					</div>

					<div className='space-y-2'>
						<label className='text-sm text-white/70'>Data</label>
						<input
							className='w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none placeholder:text-white/30'
							type='date'
							value={date}
							onChange={e => setDate(e.target.value)}
						/>
					</div>

					<div className='rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70'>
						<p className='text-white'>Sugestia sluga</p>
						<p className='mt-1 font-mono text-white/80'>{suggestedSlug || 'wpisz nazwę wydarzenia'}</p>
					</div>

					{error ? (
						<p className='rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200'>{error}</p>
					) : null}

					<button
						disabled={loading}
						className='w-full rounded-2xl bg-white px-4 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60'>
						{loading ? 'Tworzenie...' : 'Utwórz wydarzenie'}
					</button>
				</form>
			</div>
		</main>
	)
}
