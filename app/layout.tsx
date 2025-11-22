import "./globals.css"
import type React from "react"
import type { Metadata } from "next"
import { Providers } from "./providers"

export const metadata: Metadata = {
  title: "Simple Expense Tracker",
  description: "Track your expenses with ease - manage, analyze, and visualize your spending",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
