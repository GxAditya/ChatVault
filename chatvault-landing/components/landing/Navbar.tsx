"use client";

import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Use Cases", href: "#use-cases" },
    { name: "Demo", href: "#demo" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 w-full border-b border-zinc-900 bg-black/80 backdrop-blur-md"
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Type Logo */}
                <Link href="/" className="font-display font-black text-xl tracking-tighter text-white uppercase">
                    ChatVault_
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-zinc-500 hover:text-white transition-colors uppercase tracking-wide"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div className="hidden md:flex items-center">
                    <Link
                        href="https://chromewebstore.google.com/detail/chatvault-ai-chat-exporte/kmejkhbpphgkfjnglcgipmbbkpidaaeg"
                        target="_blank"
                        className="px-5 py-2 bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-colors uppercase"
                    >
                        Download
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-black border-b border-zinc-800 md:hidden"
                >
                    <div className="flex flex-col p-6 gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="text-lg font-bold text-zinc-400 hover:text-white uppercase"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="#"
                            className="w-full py-3 bg-white text-black font-bold text-center uppercase"
                        >
                            Download Extension
                        </Link>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
}
