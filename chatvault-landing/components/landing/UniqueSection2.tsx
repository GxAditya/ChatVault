"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileText, Globe } from "lucide-react";

export default function UniqueSection2() {
    return (
        <section className="py-32 px-4 bg-zinc-950 border-b border-zinc-900">
            <div className="container mx-auto max-w-6xl w-full flex flex-col items-center">

                <div className="text-center max-w-3xl mb-16">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 uppercase">
                        Universal Format
                    </h2>
                    <p className="text-lg text-zinc-500 max-w-md mx-auto">
                        Standardized PDF export preserving markdown, code syntax, and image assets.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-0 border border-zinc-800 bg-black p-8 md:p-12">

                    {/* Node 1: Web */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 border border-zinc-800 bg-zinc-900 grid place-items-center">
                            <Globe size={32} className="text-white" strokeWidth={1} />
                        </div>
                        <span className="font-mono text-xs text-zinc-500">SOURCE: WEB</span>
                    </div>

                    {/* Connector */}
                    <div className="h-12 w-px md:w-24 md:h-px bg-zinc-800 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-2">
                            <ArrowRight size={16} className="text-zinc-600" />
                        </div>
                    </div>

                    {/* Node 2: PDF */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 border border-white bg-white grid place-items-center">
                            <FileText size={32} className="text-black" strokeWidth={1} />
                        </div>
                        <span className="font-mono text-xs text-white bg-zinc-900 px-2 py-0.5">TARGET: PDF</span>
                    </div>

                </div>

                {/* Code Visual */}
                <div className="mt-12 w-full max-w-md border border-zinc-800 bg-black font-mono text-xs p-4 text-zinc-500">
                    <div className="border-b border-zinc-900 pb-2 mb-2 flex justify-between">
                        <span>MANIFEST.JSON</span>
                        <span>1.2KB</span>
                    </div>
                    <p className="text-zinc-600">{"{"}</p>
                    <p className="pl-4">"target": "pdf",</p>
                    <p className="pl-4">"preserve_styles": true,</p>
                    <p className="pl-4">"syntax_highlighting": "monokai"</p>
                    <p className="text-zinc-600">{"}"}</p>
                </div>

            </div>
        </section>
    );
}
