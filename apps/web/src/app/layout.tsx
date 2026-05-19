import type { Metadata } from 'next'
import './globals.css'
import { NavBar } from './components/NavBar'
export const metadata: Metadata = {
	title: 'WeddingSnap',
	description: 'Wesele przez QR — zdjęcia gości w jednej galerii.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='pl'>
			<body>
				<NavBar />
				{children}
			</body>
		</html>
	)
}
