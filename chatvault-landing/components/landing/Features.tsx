"use client";

import { motion } from "framer-motion";
import {
    Moon,
    GitBranch,
    BrainCircuit,
    ListOrdered,
    ScanSearch,
    Code2
} from "lucide-react";

const features = [
    { icon: Moon, title: "DARK_MODE_PDF", desc: "Exports respect your theme. Perfect for reading at night." },
    { icon: GitBranch, title: "MERMAID_RENDER", desc: "Diagrams and charts are preserved in vector format." },
    { icon: BrainCircuit, title: "THOUGHT_TRACE", desc: "Capture AI reasoning chains and hidden thought processes." },
    { icon: ListOrdered, title: "ORDER_PRESERVED", desc: "Maintains exact conversation chronology and context." },
    { icon: ScanSearch, title: "AUTO_DETECT", desc: "Automatically identifies platform (ChatGPT, Claude, etc)." },
    { icon: Code2, title: "OPEN_SOURCE", desc: "Transparency first. Audit the code on GitHub." },
];

export default function Features() {
    return (
        <section id="features" className="py-24 px-4 bg-black border-t border-zinc-900">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <h2 className="text-4xl md:text-6xl font-display font-black text-white uppercase leading-none">
                        System<br />Capabilities
                    </h2>
                    <p className="text-zinc-500 max-w-sm text-right font-mono text-xs">
                        MODULES_ACTIVE: 6/6<br />
                        INTEGRITY: 100%<br />
                        VERSION: 1.1.0
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-zinc-900 bg-black">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            className="p-8 border-b border-r border-zinc-900 hover:bg-zinc-950 transition-colors group cursor-crosshair relative min-h-[200px] flex flex-col justify-between"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="absolute top-4 right-4 text-[10px] text-zinc-700 font-mono">
                                0{i + 1}
                            </div>
                            <div className="mb-6 text-white group-hover:text-zinc-300 transition-colors">
                                <feature.icon size={32} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2 font-mono uppercase tracking-tight">{feature.title}</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
