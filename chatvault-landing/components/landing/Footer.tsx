"use client";

import { motion } from "framer-motion";
import { Download, Github, Twitter, Mail, Chrome, Globe } from "lucide-react";
import Link from "next/link";

export function CTA() {
    return (
        <section className="py-32 px-4 text-center border-b border-zinc-900 bg-zinc-950">
            <div className="container mx-auto max-w-4xl">
                <h2 className="text-6xl md:text-9xl font-display font-black text-white mb-12 uppercase tracking-tighter">
                    Take Control Now.
                </h2>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <a
                        href="/downloads/chatvault-chrome.zip"
                        download
                        className="group relative inline-flex items-center justify-center gap-4 px-8 py-5 bg-white hover:bg-zinc-200 transition-colors text-black font-black text-lg uppercase tracking-wider min-w-[240px]"
                    >
                        <Chrome size={24} />
                        <span>Chrome (ZIP)</span>
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-black/5 pointer-events-none" />
                    </a>

                    <a
                        href="https://addons.mozilla.org/en-US/firefox/addon/chatvault-ai-chat-exporter/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center justify-center gap-4 px-8 py-5 bg-transparent border border-zinc-700 hover:bg-zinc-900 hover:border-zinc-600 transition-colors text-white font-black text-lg uppercase tracking-wider min-w-[240px]"
                    >
                        <Globe size={24} />
                        <span>Add to Firefox</span>
                    </a>
                </div>

                <p className="mt-8 text-xs font-mono text-zinc-500">
                    VERSION 1.2.0 • OPEN SOURCE • NO DATA COLLECTION
                </p>
            </div>
        </section>
    );
}

export function Footer() {
    return (
        <footer className="py-12 bg-black">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="font-display font-black text-xl text-white uppercase tracking-tighter">
                    ChatVault_
                </div>

                <div className="flex items-center gap-8">
                    <Link href="https://github.com/GxAditya/ChatVault" target="_blank" className="text-zinc-500 hover:text-white transition-colors"><Github size={20} /></Link>
                    <Link href="https://x.com/kaditya264" target="_blank" className="text-zinc-500 hover:text-white transition-colors"><Twitter size={20} /></Link>
                    <Link href="mailto:kradi2098@gmail.com" className="text-zinc-500 hover:text-white transition-colors"><Mail size={20} /></Link>
                </div>

                <div className="text-xs font-mono text-zinc-500">
                    © {new Date().getFullYear()} CHATVAULT SYSTEM.
                </div>
            </div>
        </footer>
    );
}
