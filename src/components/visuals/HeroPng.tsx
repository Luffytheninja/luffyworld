'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

import { HERO_ASSETS } from '@/data/assets';

export default function HeroPng({ index = 0, className = "" }: { index?: number, className?: string }) {
    const [isHovered, setIsHovered] = useState(false);
    const asset = HERO_ASSETS[index % HERO_ASSETS.length];
    const path = asset?.path || `/assets/heros/image-removebg-preview.png`;

    return (
        <motion.div
            className={`relative cursor-crosshair ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 select-none">
                <Image
                    src={path}
                    alt="Creative Artifact"
                    fill
                    className="object-contain drop-shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 brightness-95"
                    priority
                />

                {/* Floating Metadata */}
                <motion.div
                    animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                    className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-ink text-surface px-3 py-1 text-[8px] font-mono uppercase tracking-[0.2em] pointer-events-none"
                >
                    Artifact.0{index + 1} // Input_Detected
                </motion.div>
            </div>

            {/* Background decoration */}
            <div className="absolute inset-0 z-[-1] opacity-5">
                <div className="absolute inset-0 border border-ink rounded-full animate-pulse" />
            </div>
        </motion.div>
    );
}
