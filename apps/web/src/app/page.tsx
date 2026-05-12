import Link from 'next/link'

const features = [
	{
		title: 'QR na stół',
		description: 'Para młoda drukuje kod, goście skanują i od razu robią zdjęcie.',
	},
	{
		title: 'Aparat w przeglądarce',
		description: 'Bez instalowania aplikacji. Telefon otwiera aparat i upload.',
	},
	{
		title: 'Galeria dla pary młodej',
		description: 'Wszystkie zdjęcia lecą do jednego panelu i można je później przeglądać.',
	},
]

export default function HomePage() {
	return (
		<main className='min-h-screen px-4 py-6 sm:px-6 lg:px-8'>
			<div className='mx-auto max-w-6xl'>
				<header className='flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur'>
					<div>
						<p className='text-sm text-white/60'>WeddingSnap</p>
						<h1 className='text-lg font-semibold'>Zdjęcia z wesela przez QR</h1>
					</div>

					<div className='flex gap-2'>
						<Link
							href='/login'
							className='rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10'>
							Zaloguj
						</Link>
						<Link
							href='/register'
							className='rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90'>
							Załóż konto
						</Link>
					</div>
				</header>

				<section className='grid gap-8 py-14 lg:grid-cols-2 lg:items-center lg:py-20'>
					<div className='space-y-6'>
						<span className='inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70'>
							SaaS dla wesel i eventów
						</span>

						<div className='space-y-4'>
							<h2 className='text-4xl font-bold leading-tight sm:text-5xl'>
								Goście skanują QR, robią zdjęcie i wrzucają je prosto do galerii.
							</h2>
							<p className='max-w-xl text-base leading-7 text-white/70 sm:text-lg'>
								Para młoda zakłada konto, tworzy wydarzenie, generuje QR do druku i ma pełny panel zdjęć z całego
								wesela. Bez instalacji aplikacji.
							</p>
						</div>

						<div className='flex flex-col gap-3 sm:flex-row'>
							<Link
								href='/register'
								className='inline-flex items-center justify-center rounded-2xl bg-white px-6 py-4 text-base font-semibold text-black transition hover:opacity-90'>
								Zacznij za darmo
							</Link>
							<Link
								href='/dashboard'
								className='inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-base font-semibold text-white transition hover:bg-white/10'>
								Panel demo
							</Link>
						</div>

						<div className='grid gap-3 sm:grid-cols-3'>
							{['Responsywny front', 'Camera UI', 'Panel + QR'].map(item => (
								<div key={item} className='rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70'>
									{item}
								</div>
							))}
						</div>
					</div>

					<div className='rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur'>
						<div className='rounded-[1.5rem] bg-black p-4'>
							<div className='mb-4 flex items-center justify-between'>
								<div>
									<p className='text-sm text-white/60'>Publiczny link</p>
									<p className='font-semibold'>/e/ania-i-pawel-2026</p>
								</div>
								<span className='rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300'>live upload</span>
							</div>

							<div className='grid gap-3'>
								<div className='rounded-2xl border border-white/10 bg-white/5 p-4'>
									<p className='text-sm text-white/60'>Gość otwiera stronę</p>
									<p className='mt-1 text-white'>Aparat uruchamia się automatycznie</p>
								</div>
								<div className='rounded-2xl border border-white/10 bg-white/5 p-4'>
									<p className='text-sm text-white/60'>Robi zdjęcie</p>
									<p className='mt-1 text-white'>Jeden klik i upload na serwer</p>
								</div>
								<div className='rounded-2xl border border-white/10 bg-white/5 p-4'>
									<p className='text-sm text-white/60'>Para młoda ogląda w panelu</p>
									<p className='mt-1 text-white'>Wszystkie zdjęcia w jednym miejscu</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className='grid gap-4 pb-16 md:grid-cols-3'>
					{features.map(item => (
						<div key={item.title} className='rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur'>
							<h3 className='text-xl font-semibold'>{item.title}</h3>
							<p className='mt-3 text-sm leading-6 text-white/70'>{item.description}</p>
						</div>
					))}
				</section>
			</div>
		</main>
	)
}
