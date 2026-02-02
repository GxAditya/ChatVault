"use client";

import { motion } from "framer-motion";
import { Folder, Search, Tag } from "lucide-react";

export default function UniqueSection3() {
    return (
        <section className="py-32 px-4 border-b border-zinc-900 bg-black">
            <div className="container mx-auto max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                {/* Left: Content */}
                <div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 uppercase leading-none">
                        Your Second Brain,<br />
                        Archived Forever.
                    </h2>
                    <p className="text-lg text-zinc-500 mb-12">
                        Stop searching through history. Build a local, offline-accessible library of your most valuable AI interactions.
                    </p>

                    <div className="border border-zinc-900">
                        {[
                            { icon: Tag, title: "TAGGING_SYSTEM", desc: "Meta-data injection." },
                            { icon: Folder, title: "FILE_STRUCTURE", desc: "Hierarchical organization." },
                            { icon: Search, title: "INDEXING", desc: "Full-text OCR compatible." }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col gap-2 p-6 border-b border-zinc-900 last:border-0 hover:bg-zinc-950 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold text-white font-mono uppercase">{item.title}</h3>
                                    <item.icon size={16} className="text-zinc-600" />
                                </div>
                                <p className="text-sm text-zinc-600 font-mono">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Visual */}
                <div className="relative pt-12 pl-12">
                    {/* Card 1 */}
                    <div className="absolute top-0 left-0 w-full h-full border border-zinc-800 bg-zinc-950 z-0" />

                    {/* Card 2 */}
                    <div className="absolute top-6 left-6 w-full h-full border border-zinc-800 bg-black z-10 flex flex-col p-6">
                        <div className="flex justify-between items-center border-b border-zinc-900 pb-4 mb-4">
                            <span className="font-mono text-xs text-zinc-500">ARCHIVE_ID: 9283</span>
                            <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                        <div className="space-y-4">
                            <div className="h-2 w-3/4 bg-zinc-900" />
                            <div className="h-2 w-1/2 bg-zinc-900" />
                            <div className="h-32 w-full border border-zinc-900 bg-zinc-950/50 p-4 font-mono text-[10px] text-zinc-700">
                        // content preview
                                <br />
                                Chat_Session_01 started...
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
