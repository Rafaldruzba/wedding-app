import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
	title: 'WeddingSnap',
	description: 'Wesele przez QR — zdjęcia gości w jednej galerii.',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='pl'>
			<body>{children}</body>
		</html>
	)
}
