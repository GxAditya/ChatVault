"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useState } from "react";

export default function DemoSection() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <section id="demo" className="py-24 px-4 bg-zinc-950 border-y border-zinc-900">
            <div className="container mx-auto max-w-5xl">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-display font-bold text-white uppercase tracking-tight">
                            See ChatVault in Action
                        </h2>
                        <p className="text-zinc-500 font-mono text-xs mt-2">
                            &gt; 60 SECONDS TO EFFICIENT ARCHIVING.
                        </p>
                    </div>
                    <div className="flex gap-2 text-[10px] font-mono text-zinc-500">
                        <span>REC</span>
                        <span className="animate-pulse text-red-500">●</span>
                    </div>
                </div>

                {/* Video Placeholder Container */}
                <div className="w-full aspect-video bg-black border border-zinc-800 relative group overflow-hidden">

                    {/* Grid overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />

                    {!isPlaying ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <button
                                onClick={() => setIsPlaying(true)}
                                className="w-20 h-20 bg-white hover:bg-zinc-200 transition-colors rounded-full flex items-center justify-center group/btn"
                            >
                                <Play size={32} className="ml-1 text-black" fill="currentColor" />
                            </button>
                            <div className="absolute bottom-8 left-8 font-mono text-xs text-zinc-500">
                                PENDING_INPUT: AWAITING_FOOTAGE
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full bg-black">
                            <video
                                src="/chat-vault-demo.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Decorative UI elements */}
                    <div className="absolute top-4 left-4 w-2 h-2 border border-white/50" />
                    <div className="absolute top-4 right-4 w-2 h-2 border border-white/50" />
                    <div className="absolute bottom-4 left-4 w-2 h-2 border border-white/50" />
                    <div className="absolute bottom-4 right-4 w-2 h-2 border border-white/50" />
                </div>

            </div>
        </section>
    );
}
