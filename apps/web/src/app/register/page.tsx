'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { apiFetch } from '../lib/api'

export default function RegisterPage() {
	const router = useRouter()
	const [form, setForm] = useState({
		name: '',
		email: '',
		password: '',
	})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError('')

		try {
			const data = await apiFetch<{ accessToken?: string }>('/auth/register', {
				method: 'POST',
				body: JSON.stringify(form),
			})

			if (data?.accessToken) {
				localStorage.setItem('token', data.accessToken)
			}

			router.push('/dashboard')
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Błąd rejestracji')
		} finally {
			setLoading(false)
		}
	}

	return (
		<main className='flex min-h-screen items-center justify-center px-4 py-10'>
			<div className='w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur'>
				<div className='mb-6'>
					<p className='text-sm text-white/60'>WeddingSnap</p>
					<h1 className='mt-1 text-3xl font-bold'>Załóż konto</h1>
					<p className='mt-2 text-sm leading-6 text-white/70'>Para młoda tworzy konto, potem event i QR do wydruku.</p>
				</div>

				<form className='space-y-4' onSubmit={onSubmit}>
					<input
						className='w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none placeholder:text-white/30'
						placeholder='Imię i nazwisko'
						value={form.name}
						onChange={e => setForm(s => ({ ...s, name: e.target.value }))}
					/>
					<input
						className='w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none placeholder:text-white/30'
						placeholder='Email'
						type='email'
						value={form.email}
						onChange={e => setForm(s => ({ ...s, email: e.target.value }))}
					/>
					<input
						className='w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none placeholder:text-white/30'
						placeholder='Hasło'
						type='password'
						value={form.password}
						onChange={e => setForm(s => ({ ...s, password: e.target.value }))}
					/>

					{error ? (
						<p className='rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200'>{error}</p>
					) : null}

					<button
						disabled={loading}
						className='w-full rounded-2xl bg-white px-4 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60'>
						{loading ? 'Tworzenie konta...' : 'Załóż konto'}
					</button>
				</form>

				<p className='mt-5 text-sm text-white/60'>
					Masz już konto?{' '}
					<Link className='text-white underline' href='/login'>
						Zaloguj się
					</Link>
				</p>
			</div>
		</main>
	)
}
