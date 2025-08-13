import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'PlotTwist'
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          {children}
        </div>
        
        {/* Global Scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent flash of unstyled content
              document.documentElement.classList.add('dark');
            `,
          }}
        />
      </body>
    </html>
  )
}