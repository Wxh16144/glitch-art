import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import './global.css';

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
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
