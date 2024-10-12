// File: app/layout.tsx

import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
import { Raleway } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/ui/Navbar'
import { ClientWalletProvider } from '@/components/ui/WalletProvider'

const raleway = Raleway({ 
  subsets: ['latin'],
  variable: '--font-raleway',
})
export const metadata: Metadata = {
  title: 'BULK Vaults',
  description: 'Institutional grade market making meets consumer liquidity',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${raleway.className}bg-custom-bg text-black`}>
        <ClientWalletProvider>
          <Navbar />
          {children}
        </ClientWalletProvider>
      </body>
    </html>
  )
}