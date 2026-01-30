"use client";

import { motion } from "framer-motion";
import { Chrome, Globe, Cog, Upload, FileCode } from "lucide-react";
import Image from "next/image";

export default function InstallationGuide() {
    return (
        <section className="py-24 px-4 bg-zinc-950/50 border-y border-zinc-900">
            <div className="container mx-auto max-w-5xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                        Developer Installation
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Until approved by the stores, you can install ChatVault manually in Developer Mode.
                        <br />It takes less than 30 seconds.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Chrome Guide */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                                <Chrome className="text-white" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white">Chrome / Brave / Edge</h3>
                        </div>

                        <div className="space-y-4">
                            <Step
                                number="01"
                                title="Unzip the Download"
                                description="Extract the 'chatvault-chrome.zip' file to a folder on your computer."
                                icon={<FileCode size={18} />}
                            />
                            <Step
                                number="02"
                                title="Open Extensions Page"
                                description={<span>Navigate to <code className="bg-zinc-900 px-1 py-0.5 rounded text-zinc-300">chrome://extensions</code> in your browser.</span>}
                                icon={<Cog size={18} />}
                            />
                            <Step
                                number="03"
                                title="Enable Developer Mode"
                                description="Toggle the 'Developer mode' switch in the top-right corner."
                                icon={<Cog size={18} />}
                            />
                            <Step
                                number="04"
                                title="Load Unpacked"
                                description="Click 'Load unpacked' and select the folder you extracted in Step 1."
                                icon={<Upload size={18} />}
                            />
                        </div>
                    </motion.div>

                    {/* Firefox Guide */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                                <Globe className="text-white" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white">Firefox</h3>
                        </div>

                        <div className="space-y-4">
                            <Step
                                number="01"
                                title="Download XPI"
                                description="Download the 'chatvault-firefox.xpi' file."
                                icon={<FileCode size={18} />}
                            />
                            <Step
                                number="02"
                                title="Open Debugging Page"
                                description={<span>Navigate to <code className="bg-zinc-900 px-1 py-0.5 rounded text-zinc-300">about:debugging</code> in Firefox.</span>}
                                icon={<Cog size={18} />}
                            />
                            <Step
                                number="03"
                                title="Select 'This Firefox'"
                                description="Click on 'This Firefox' in the left sidebar menu."
                                icon={<Cog size={18} />}
                            />
                            <Step
                                number="04"
                                title="Load Temporary Add-on"
                                description="Click 'Load Temporary Add-on...' and select the .xpi file."
                                icon={<Upload size={18} />}
                            />
                        </div>

                        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-200/80 leading-relaxed">
                            <span className="font-bold text-yellow-500 block mb-1">Note for Firefox Users:</span>
                            Temporary add-ons are removed when you restart Firefox. We are currently pending review on the Firefox Add-ons Store for permanent installation.
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function Step({ number, title, description, icon }: { number: string; title: string; description: React.ReactNode; icon: React.ReactNode }) {
    return (
        <div className="flex gap-4 p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50 hover:border-zinc-700 transition-colors group">
            <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 font-mono text-sm font-bold group-hover:text-white group-hover:border-zinc-600 transition-colors">
                {number}
            </div>
            <div>
                <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                    {title}
                </h4>
                <div className="text-sm text-zinc-400 leading-relaxed">
                    {description}
                </div>
            </div>
        </div>
    );
}
