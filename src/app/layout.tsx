import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import './global.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Glitch Art — Your text, glitched",
  description: "Type a word, get a self-contained glitch-art SVG. Fonts embedded, colors doubled, motion included — paste the URL anywhere.",
  openGraph: {
    title: "Glitch Art",
    description: "Enjoy the glitch art effect on your text.",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
