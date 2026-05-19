import Link from 'next/link'

const features = [
	{
		icon: '◈',
		title: 'Kod QR na stół',
		description: 'Wydrukuj i połóż na stołach. Goście skanują i od razu lądują na stronie aparatu.',
	},
	{
		icon: '◉',
		title: 'Aparat bez aplikacji',
		description: 'Kamera otwiera się bezpośrednio w przeglądarce. Żadnych instalacji, żadnych kont.',
	},
	{
		icon: '◎',
		title: 'Galeria dla pary',
		description: 'Wszystkie zdjęcia gości spływają do jednego panelu. Pobierz cały album jednym klikiem.',
	},
]

export default function HomePage() {
	return (
		<main style={{ minHeight: '100vh' }}>
			{/* Hero */}
			<section
				style={{
					maxWidth: 1200,
					margin: '0 auto',
					padding: '80px 24px 100px',
					display: 'grid',
					gridTemplateColumns: '1fr 1fr',
					gap: 64,
					alignItems: 'center',
				}}
				className='fade-up'>
				<div>
					<span
						className='tag'
						style={{ color: 'var(--gold)', borderColor: 'rgba(201,169,110,0.3)', marginBottom: 32 }}>
						✦ SaaS dla wesel i eventów
					</span>

					<h1
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
							fontWeight: 700,
							lineHeight: 1.15,
							color: 'var(--white)',
							marginTop: 16,
							marginBottom: 24,
						}}>
						Zdjęcia z wesela <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>od wszystkich gości</em>
						,<br />w jednym miejscu.
					</h1>

					<p
						style={{
							fontSize: '1.05rem',
							color: 'var(--muted)',
							lineHeight: 1.75,
							maxWidth: 480,
							marginBottom: 40,
						}}>
						Para młoda zakłada konto, tworzy wydarzenie, generuje QR do druku. Goście skanują, robią zdjęcie — bez
						instalacji, bez logowania.
					</p>

					<div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
						<Link href='/register' className='btn-primary' style={{ fontSize: '0.95rem', padding: '14px 32px' }}>
							Zacznij za darmo
						</Link>
						<Link href='/dashboard' className='btn-secondary' style={{ fontSize: '0.95rem', padding: '14px 32px' }}>
							Panel demo
						</Link>
					</div>
				</div>

				{/* Mock card */}
				<div className='card' style={{ padding: 4, overflow: 'hidden' }}>
					<div
						style={{
							background: 'var(--bg)',
							borderRadius: 'calc(var(--radius-lg) - 4px)',
							padding: 24,
						}}>
						<div
							style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
							<div>
								<p
									style={{
										fontSize: '0.75rem',
										color: 'var(--muted)',
										textTransform: 'uppercase',
										letterSpacing: '0.08em',
										marginBottom: 6,
									}}>
									Aktywne wydarzenie
								</p>
								<p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600 }}>
									Ania & Paweł — 2026
								</p>
							</div>
							<span
								className='tag'
								style={{ color: 'var(--green)', borderColor: 'rgba(126,200,154,0.3)', fontSize: '0.7rem' }}>
								● live
							</span>
						</div>

						<div style={{ display: 'grid', gap: 10 }}>
							{[
								{ label: 'Gość otwiera link z QR', sub: 'Aparat uruchamia się automatycznie' },
								{ label: 'Robi zdjęcie', sub: 'Podgląd, a potem jeden klik — wysłane' },
								{ label: 'Para ogląda galerię', sub: 'Zdjęcia pojawiają się w panelu na żywo' },
							].map((item, i) => (
								<div
									key={i}
									className='card-sm'
									style={{
										padding: '14px 16px',
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}>
									<div>
										<p style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: 2 }}>{item.label}</p>
										<p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{item.sub}</p>
									</div>
									<span style={{ color: 'var(--gold)', fontSize: '1.1rem' }}>›</span>
								</div>
							))}
						</div>

						<div
							style={{
								marginTop: 16,
								padding: '10px 16px',
								borderRadius: 12,
								background: 'var(--gold-glow)',
								border: '1px solid rgba(201,169,110,0.2)',
								display: 'flex',
								alignItems: 'center',
								gap: 10,
							}}>
							<span style={{ fontSize: '0.8rem', color: 'var(--gold)' }}>◉</span>
							<span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
								<b style={{ color: 'var(--gold)' }}>247</b> zdjęć · ostatnie 4 min temu
							</span>
						</div>
					</div>
				</div>
			</section>

			{/* Divider */}
			<div style={{ borderTop: '1px solid var(--border)', maxWidth: 1200, margin: '0 auto' }} />

			{/* Features */}
			<section
				style={{
					maxWidth: 1200,
					margin: '0 auto',
					padding: '80px 24px',
					display: 'grid',
					gridTemplateColumns: 'repeat(3, 1fr)',
					gap: 20,
				}}>
				{features.map((f, i) => (
					<div key={f.title} className='card' style={{ padding: 32, animationDelay: `${i * 0.1}s` }}>
						<span
							style={{
								display: 'block',
								fontFamily: 'var(--font-display)',
								fontSize: '1.8rem',
								color: 'var(--gold)',
								marginBottom: 20,
							}}>
							{f.icon}
						</span>
						<h3
							style={{
								fontFamily: 'var(--font-display)',
								fontSize: '1.2rem',
								fontWeight: 600,
								marginBottom: 12,
							}}>
							{f.title}
						</h3>
						<p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.7 }}>{f.description}</p>
					</div>
				))}
			</section>

			{/* CTA */}
			<section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 100px' }}>
				<div
					className='card'
					style={{
						padding: '60px 48px',
						textAlign: 'center',
						background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(201,169,110,0.05) 100%)',
					}}>
					<h2
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
							fontWeight: 700,
							marginBottom: 16,
						}}>
						Gotowy na pierwszy event?
					</h2>
					<p style={{ color: 'var(--muted)', marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
						Konto zajmuje 30 sekund. QR możesz wydrukować przed weselem.
					</p>
					<Link href='/register' className='btn-primary' style={{ fontSize: '0.95rem', padding: '14px 36px' }}>
						Załóż konto — to nic nie kosztuje
					</Link>
				</div>
			</section>

			{/* Responsive styles */}
			<style>{`
        @media (max-width: 768px) {
          section:first-of-type { grid-template-columns: 1fr !important; padding: 48px 20px 64px !important; }
          section:nth-of-type(2) { grid-template-columns: 1fr !important; }
        }
      `}</style>
		</main>
	)
}
