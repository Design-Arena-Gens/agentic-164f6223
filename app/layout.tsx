import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Личные Расходы',
  description: 'Трекер личных расходов',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
