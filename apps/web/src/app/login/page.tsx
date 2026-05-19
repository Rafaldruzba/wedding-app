'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { apiFetch } from '../lib/api'
import { setToken } from '../lib/auth'

export default function LoginPage() {
	const router = useRouter()
	const [form, setForm] = useState({ email: '', password: '' })
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError('')

		try {
			const data = await apiFetch<{ accessToken?: string }>(
				'/auth/login',
				{
					method: 'POST',
					body: JSON.stringify(form),
				},
				false,
			)

			if (data?.accessToken) setToken(data.accessToken)
			router.push('/dashboard')
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Błąd logowania')
		} finally {
			setLoading(false)
		}
	}

	return (
		<main
			style={{
				minHeight: 'calc(100vh - 60px)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '40px 20px',
			}}>
			<div className='card fade-up' style={{ width: '100%', maxWidth: 420, padding: '40px 36px' }}>
				<p
					style={{
						fontSize: '0.75rem',
						textTransform: 'uppercase',
						letterSpacing: '0.1em',
						color: 'var(--gold)',
						marginBottom: 12,
					}}>
					Witaj z powrotem
				</p>
				<h1
					style={{
						fontFamily: 'var(--font-display)',
						fontSize: '2rem',
						fontWeight: 700,
						marginBottom: 8,
					}}>
					Zaloguj się
				</h1>
				<p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: 32 }}>
					Wejdź do panelu, dodawaj eventy i generuj QR.
				</p>

				<form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
					<div>
						<label className='label'>Email</label>
						<input
							className='input'
							type='email'
							placeholder='para@wesele.pl'
							value={form.email}
							onChange={e => setForm(s => ({ ...s, email: e.target.value }))}
							required
						/>
					</div>
					<div>
						<label className='label'>Hasło</label>
						<input
							className='input'
							type='password'
							placeholder='••••••••'
							value={form.password}
							onChange={e => setForm(s => ({ ...s, password: e.target.value }))}
							required
						/>
					</div>

					{error && <p className='error-box'>{error}</p>}

					<button
						type='submit'
						disabled={loading}
						className='btn-primary'
						style={{ marginTop: 8, padding: '14px', fontSize: '0.95rem', borderRadius: 'var(--radius-sm)' }}>
						{loading ? (
							<>
								<span className='spinner' style={{ width: 16, height: 16 }} /> Logowanie…
							</>
						) : (
							'Zaloguj się'
						)}
					</button>
				</form>

				<p style={{ marginTop: 24, fontSize: '0.875rem', color: 'var(--muted)', textAlign: 'center' }}>
					Nie masz konta?{' '}
					<Link href='/register' style={{ color: 'var(--gold)', textDecoration: 'underline' }}>
						Załóż konto
					</Link>
				</p>
			</div>
		</main>
	)
}
