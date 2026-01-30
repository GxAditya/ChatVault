import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChatVault - Export AI Chats to PDF",
  description: "Securely export your ChatGPT, Claude, and Gemini conversations to clean, formatted PDFs with ChatVault.",
  icons: {
    icon: [
      { url: '/icon16.png', sizes: '16x16' },
      { url: '/icon32.png', sizes: '32x32' },
      { url: '/icon48.png', sizes: '48x48' },
      { url: '/icon128.png', sizes: '128x128' },
    ],
    apple: '/icon128.png',
  },
  openGraph: {
    title: "ChatVault - Export AI Chats to PDF",
    description: "Securely export your ChatGPT, Claude, and Gemini conversations to clean, formatted PDFs with ChatVault.",
    images: [
      {
        url: "/og.webp",
        width: 1200,
        height: 630,
        alt: "ChatVault Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChatVault - Export AI Chats to PDF",
    description: "Securely export your ChatGPT, Claude, and Gemini conversations to clean, formatted PDFs with ChatVault.",
    images: ["/og.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${syne.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
