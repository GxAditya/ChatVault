"use client";

import { motion } from "framer-motion";
import { Lock, ServerOff, ShieldCheck } from "lucide-react";

export default function UniqueSection1() {
    return (
        <section className="py-32 px-4 relative border-b border-zinc-900 bg-black">
            <div className="container mx-auto max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left: Content */}
                <div className="order-2 lg:order-1">
                    <div className="mb-6 font-mono text-xs text-zinc-500">
             // ARCHITECTURE_TYPE: ZERO_SERVER
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 uppercase leading-none">
                        Your Data.<br />
                        Your Device.
                    </h2>
                    <p className="text-lg text-zinc-500 leading-relaxed mb-12 max-w-md">
                        Processing occurs locally within the browser instance. No external API calls. No telemetry.
                    </p>

                    <div className="space-y-px bg-zinc-900 border border-zinc-900">
                        {[
                            { icon: ServerOff, title: "OFFLINE_MODE", desc: "No internet required." },
                            { icon: Lock, title: "ENCRYPTION", desc: "Local storage only." },
                            { icon: ShieldCheck, title: "COMPLIANCE", desc: "GDPR / CCPA Ready." }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-6 p-6 bg-black hover:bg-zinc-950 transition-colors">
                                <item.icon size={24} className="text-white" strokeWidth={1.5} />
                                <div>
                                    <h3 className="font-bold text-white font-mono text-sm">{item.title}</h3>
                                    <p className="text-xs text-zinc-600 font-mono">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Visual */}
                <div className="order-1 lg:order-2 flex justify-center">
                    <div className="relative w-full aspect-square max-w-sm border border-zinc-800 bg-zinc-950 p-8 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <ShieldCheck size={48} className="text-white" strokeWidth={1} />
                            <div className="text-right">
                                <div className="text-[10px] text-zinc-600 font-mono">SECURE_ENCLAVE</div>
                                <div className="text-xs text-white font-bold">ACTIVE</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            {[...Array(16)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="aspect-square bg-zinc-900"
                                    initial={{ opacity: 0.2 }}
                                    animate={{ opacity: [0.2, 1, 0.2] }}
                                    transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                                />
                            ))}
                        </div>

                        <div className="font-mono text-[10px] text-zinc-600">
                            0x8473...2934 [VERIFIED]
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
