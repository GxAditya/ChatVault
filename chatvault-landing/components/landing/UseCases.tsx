"use client";

import { motion } from "framer-motion";

const cases = [
    {
        title: "STUDENTS",
        desc: "Archive study sessions. Annotate PDFs.",
        id: "01"
    },
    {
        title: "DEVELOPERS",
        desc: "Save debugging logs. Searchable code history.",
        id: "02"
    },
    {
        title: "RESEARCH",
        desc: "Preserve deep-dive conversations permanent.",
        id: "03"
    },
    {
        title: "CREATORS",
        desc: "Keep brainstorming sessions offline.",
        id: "04"
    }
];

export default function UseCases() {
    return (
        <section id="use-cases" className="py-24 px-4 bg-zinc-950 border-t border-zinc-900">
            <div className="container mx-auto max-w-6xl">
                <div className="mb-12 border-b border-zinc-900 pb-4 flex justify-between items-end">
                    <h2 className="text-3xl font-display font-bold text-white uppercase tracking-tight">
                        Target Vectors
                    </h2>
                    <span className="font-mono text-xs text-zinc-600">SECTORS_IDENTIFIED: 4</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-900 border border-zinc-900">
                    {cases.map((item, i) => (
                        <motion.div
                            key={i}
                            className="bg-black p-8 group hover:bg-zinc-950 transition-colors"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                        >
                            <div className="font-mono text-xs text-zinc-600 mb-8 flex justify-between">
                                <span>CASE_{item.id}</span>
                                <span className="w-2 h-2 bg-zinc-800 group-hover:bg-white transition-colors" />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 relative z-10">{item.title}</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed max-w-[15ch]">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
