'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { SECTIONS } from '@/data/sections';
import { useSceneStore } from '@/store/useSceneStore';

interface NavigationProps {
    variant?: 'overlay' | 'fixed';
}

export default function Navigation({ variant = 'fixed' }: NavigationProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { currentSection, performanceMode, togglePerformanceMode } = useSceneStore();

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Navigation trigger */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                onClick={toggleMenu}
                className={`fixed z-40 p-4 transition-colors duration-300 ${variant === 'fixed' ? 'top-4 right-4 md:top-8 md:right-8' : 'top-4 right-4'
                    }`}
                aria-label="Toggle navigation"
            >
                <div className="flex flex-col gap-1.5">
                    <motion.span
                        animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 6 : 0 }}
                        className="w-6 h-px bg-bone block origin-center"
                    />
                    <motion.span
                        animate={{ opacity: isOpen ? 0 : 1 }}
                        className="w-6 h-px bg-bone block"
                    />
                    <motion.span
                        animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -6 : 0 }}
                        className="w-6 h-px bg-bone block origin-center"
                    />
                </div>
            </motion.button>

            {/* Navigation overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.nav
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="fixed inset-0 z-30 flex items-center justify-center bg-charcoal/95 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="flex flex-col items-center gap-6"
                        >
                            {/* Home link */}
                            <Link
                                href="/"
                                onClick={() => setIsOpen(false)}
                                className={`nav-link text-lg ${currentSection === 'homepage' ? 'text-neon-cyan' : ''}`}
                            >
                                Home
                            </Link>

                            {/* Section links */}
                            {SECTIONS.map((section, index) => (
                                <motion.div
                                    key={section.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + index * 0.05 }}
                                >
                                    <Link
                                        href={section.route}
                                        onClick={() => setIsOpen(false)}
                                        className={`nav-link text-lg ${currentSection === section.id ? 'text-neon-cyan' : ''}`}
                                    >
                                        {section.title}
                                    </Link>
                                </motion.div>
                            ))}

                            <button
                                type="button"
                                onClick={togglePerformanceMode}
                                className="mt-2 rounded border border-bone/30 px-3 py-2 font-mono text-xs uppercase tracking-wider text-bone/80 transition-colors hover:border-neon-cyan hover:text-neon-cyan"
                            >
                                Performance mode: {performanceMode ? 'On' : 'Off'}
                            </button>
                        </motion.div>

                        {/* Footer info */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            transition={{ delay: 0.5 }}
                            className="absolute bottom-8 left-8 font-mono text-xs text-bone"
                        >
                            Luffy World
                        </motion.div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </>
    );
}
