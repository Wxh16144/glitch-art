import type { Metadata } from "next";

import './global.css';

export const metadata: Metadata = {
  title: "Glitch Art",
  description: "Generate glitch art with a simple API",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
