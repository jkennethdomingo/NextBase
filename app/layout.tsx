import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "NextBase",
  description: "A modern Next.js 15 boilerplate with built-in Supabase integration and Progressive Web App (PWA) support — perfect for kickstarting scalable, full-stack web applications.",
  generator: 'Next.js',
  manifest: '/manifest.webmanifest',
  keywords: ['stem', 'atlas', 'nextjs', 'supabase', 'pwa'],
  authors: [
    { name: 'John Kenneth Nicko M. Domingo' },
  ],
  icons: [
    { rel: 'apple-touch-icon', url: '/web-app-manifest-192x192.png' },
    { rel: 'icon', url: '/web-app-manifest-192x192.png' },
  ],
  appleWebApp: {
    title: "NextBase",
    capable: true,
    statusBarStyle: 'default',
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
