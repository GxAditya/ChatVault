"use client";

import { motion } from "framer-motion";
import { ArrowRight, Chrome, Globe } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 border-grid">
            <div className="container mx-auto px-4 text-center z-10 relative">

                {/* Decorative Grid Lines */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[1px] bg-zinc-900 -z-10" />
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[1px] bg-zinc-900 -z-10" />

                <div className="bg-white text-black text-xs font-bold uppercase tracking-widest py-1 px-3 inline-block mb-8">
                    v1.1.0 Released
                </div>

                <motion.h1
                    className="text-6xl md:text-8xl lg:text-9xl font-display font-black tracking-tighter text-white mb-6 uppercase"
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    ChatVault
                </motion.h1>

                <motion.p
                    className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-tight font-light"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Zero cloud. Zero tracking. <br />
                    <span className="text-white font-medium">100% Local AI Chat Export.</span>
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <a
                        href="/downloads/chatvault-chrome.zip"
                        download
                        className="px-6 py-4 bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-colors flex items-center gap-3 min-w-[200px] justify-center"
                    >
                        <Chrome size={20} />
                        <span>DOWNLOAD CHROME (ZIP)</span>
                    </a>

                    <a
                        href="/downloads/chatvault-firefox.xpi"
                        download
                        className="px-6 py-4 bg-transparent border border-zinc-700 text-white font-bold text-sm hover:bg-zinc-900 transition-colors flex items-center gap-3 min-w-[200px] justify-center"
                    >
                        <Globe size={20} />
                        <span>DOWNLOAD FIREFOX (XPI)</span>
                    </a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-4 text-xs text-zinc-500 font-mono"
                >
                    * Developer Mode installation required for now
                </motion.div>

                {/* Extension Mockup */}
                <div className="relative mt-24 w-full max-w-[320px] mx-auto">
                    {/* Connection Line */}
                    <div className="absolute -top-24 left-1/2 w-px h-24 bg-zinc-800" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="bg-black border border-zinc-800 shadow-[0_0_0_1px_rgba(255,255,255,0.1)] p-4 relative z-10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-900">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-white rounded-sm" />
                                <span className="font-bold text-sm tracking-tight text-white">ChatVault</span>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        </div>

                        {/* Content */}
                        <div className="space-y-4">
                            <div className="space-y-1 text-left">
                                <label className="text-[10px] font-mono text-zinc-500 uppercase">Target Platform</label>
                                <div className="p-2 border border-zinc-800 bg-zinc-950 text-xs font-mono text-white flex justify-between items-center group cursor-pointer hover:border-zinc-700">
                                    <span>chatgpt.com</span>
                                    <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full group-hover:bg-white transition-colors" />
                                </div>
                            </div>

                            <div className="space-y-1 text-left">
                                <label className="text-[10px] font-mono text-zinc-500 uppercase">Export Format</label>
                                <div className="p-2 border border-white bg-white text-black text-xs font-bold text-center cursor-default">
                                    PDF DOCUMENT (.pdf)
                                </div>
                            </div>

                            <div className="pt-2">
                                <button className="w-full py-3 bg-white hover:bg-zinc-200 transition-colors text-black font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 relative overflow-hidden group">
                                    <span className="relative z-10">Initialize Export</span>
                                    <motion.div
                                        className="absolute inset-0 bg-zinc-300 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"
                                        style={{ mixBlendMode: "difference" }}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Status Bar */}
                        <div className="mt-4 pt-3 border-t border-zinc-900 flex justify-between items-center text-[10px] font-mono text-zinc-600">
                            <span>v1.1.0</span>
                            <span className="flex items-center gap-1"><span className="w-1 h-1 bg-zinc-600 rounded-full" /> READY</span>
                        </div>

                        {/* Decorative corners */}
                        <div className="absolute -top-px -left-px w-2 h-2 border-t border-l border-white" />
                        <div className="absolute -top-px -right-px w-2 h-2 border-t border-r border-white" />
                        <div className="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-white" />
                        <div className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-white" />
                    </motion.div>

                    {/* Backdrop Glow (Subtle) */}
                    <div className="absolute -inset-4 bg-white/5 blur-2xl -z-10 rounded-full opacity-50" />
                </div>
            </div>
        </section>
    );
}
