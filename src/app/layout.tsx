import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "byvaqqas.store",
  description: "Minimalist fashion outfit discovery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <header className="sticky top-0 z-50 bg-foreground text-background transition-colors shadow-md">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-center">
            <a href="/" className="text-2xl font-semibold tracking-widest uppercase">
              byvaqqas.store
            </a>
          </div>
        </header>
        <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
          {children}
        </main>
        <footer className="w-full py-8 text-center text-xs text-gray-500 border-t border-foreground/10 mt-auto">
          <p>Links on this page are affiliate links. If you buy something through them, byvaqqas.store may earn a commission.</p>
        </footer>
      </body>
    </html>
  );
}
