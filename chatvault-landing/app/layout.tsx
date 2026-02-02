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
  title: "ChatVault - The Ultimate AI Chat Exporter (ChatGPT, Claude, Gemini)",
  description: "Stop losing your best ideas. Securely export, format, and archive your AI conversations from ChatGPT, Claude, and Gemini into professional PDFs. Local, private, and free.",
  keywords: ["ChatGPT export", "Claude backup", "Gemini PDF", "AI chat history", "browser extension", "local AI privacy"],
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
    title: "Save Your AI Chats Forever | ChatVault",
    description: "Don't trust the cloud with your best prompts. Export ChatGPT & Claude conversations to clean, local PDFs. No tracking, no servers.",
    images: [
      {
        url: "/og.webp",
        width: 1200,
        height: 630,
        alt: "ChatVault - Private AI Chat Export",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChatVault - Private AI Chat Export",
    description: "Export your ChatGPT & Claude history to PDF. 100% local, no data collection. Keep your ideas safe.",
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
