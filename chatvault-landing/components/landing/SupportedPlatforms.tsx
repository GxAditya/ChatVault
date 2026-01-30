"use client";

import { motion } from "framer-motion";

const platforms = [
    "ChatGPT", "Gemini", "Claude", "Qwen", "Z.ai", "Kimi", "DeepSeek",
    "ChatGPT", "Gemini", "Claude", "Qwen", "Z.ai", "Kimi", "DeepSeek",
];

export default function SupportedPlatforms() {
    return (
        <section className="py-12 border-y border-zinc-900 bg-black overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-black to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-black to-transparent z-10" />

            <div className="flex relative items-center">
                <div className="absolute left-1/2 -top-12 -translate-x-1/2 text-[10px] font-mono text-zinc-700 uppercase tracking-widest bg-black px-2">
                    Supported Protocols
                </div>

                <motion.div
                    className="flex gap-24 min-w-full pl-24"
                    animate={{ x: "-50%" }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                    {[...platforms, ...platforms].map((platform, index) => (
                        <div
                            key={index}
                            className="text-4xl md:text-6xl font-display font-black text-transparent text-stroke-white text-stroke-1 shrink-0 uppercase"
                            style={{ WebkitTextStroke: "1px #333" }}
                        >
                            {platform}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
