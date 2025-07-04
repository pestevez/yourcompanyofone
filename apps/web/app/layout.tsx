import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { OrganizationsProvider } from '@/lib/organizations-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Your Company of One',
  description: 'AI-powered platform for professional social media management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <OrganizationsProvider>
            <div className="min-h-screen bg-gray-50">
              {children}
            </div>
          </OrganizationsProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 