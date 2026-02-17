'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSceneStore, ASSET_REGISTRY } from '@/store/useSceneStore';
import { SectionData, SECTIONS } from '@/data/sections';
import Navigation from '@/components/layout/Navigation';

const Stage = dynamic(() => import('@/components/three/Stage'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        </div>
    ),
});

interface SectionPageProps {
    sectionId: string;
}

export default function SectionPage({ sectionId }: SectionPageProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentAssetIndex, setCurrentAssetIndex] = useState(0);
    const [showCopy, setShowCopy] = useState(false);

    const { transitionToAsset, setCurrentSection } = useSceneStore();

    // Get section data
    const section = SECTIONS.find(s => s.id === sectionId) as SectionData;
    const assets = useMemo(() => ASSET_REGISTRY[sectionId] || [], [sectionId]);

    // Get next section for navigation
    const currentSectionIndex = SECTIONS.findIndex(s => s.id === sectionId);
    const nextSection = SECTIONS[(currentSectionIndex + 1) % SECTIONS.length];
    const prevSection = SECTIONS[(currentSectionIndex - 1 + SECTIONS.length) % SECTIONS.length];

    // Scroll tracking
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    // Calculate which asset should be active based on scroll
    useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (progress) => {
            if (assets.length === 0) return;

            // Calculate asset index based on scroll progress
            const segmentSize = 1 / assets.length;
            const newIndex = Math.min(
                Math.floor(progress / segmentSize),
                assets.length - 1
            );

            if (newIndex !== currentAssetIndex && newIndex >= 0) {
                setCurrentAssetIndex(newIndex);
                setShowCopy(false);
            }
        });

        return () => unsubscribe();
    }, [scrollYProgress, assets.length, currentAssetIndex]);

    // Transition to new asset when index changes
    useEffect(() => {
        if (assets[currentAssetIndex]) {
            transitionToAsset(assets[currentAssetIndex]);
            setCurrentSection(sectionId);

            // Show copy after asset enters
            const timer = setTimeout(() => setShowCopy(true), 800);
            return () => clearTimeout(timer);
        }
    }, [currentAssetIndex, assets, transitionToAsset, setCurrentSection, sectionId]);

    // Initial load
    useEffect(() => {
        if (assets[0]) {
            transitionToAsset(assets[0]);
            setCurrentSection(sectionId);
            const timer = setTimeout(() => setShowCopy(true), 800);

            return () => {
                clearTimeout(timer);
                transitionToAsset(null);
            };
        }

        // Cleanup on unmount
        return () => {
            transitionToAsset(null);
        };
    }, [assets, sectionId, setCurrentSection, transitionToAsset]);

    // Calculate scroll height based on number of assets
    const scrollHeight = `${100 + (assets.length - 1) * 100}vh`;

    return (
        <div
            ref={containerRef}
            className="relative bg-charcoal"
            style={{ minHeight: scrollHeight }}
        >
            {/* Navigation */}
            <Navigation />

            {/* Fixed 3D Stage */}
            <div className="fixed inset-0 z-0">
                <Stage enableOrbit={false} />
            </div>

            {/* Content overlay - fixed position */}
            <div className="fixed inset-0 z-10 pointer-events-none flex items-end">
                <div className="w-full p-6 md:p-12">
                    {/* Section header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: showCopy ? 1 : 0, y: showCopy ? 0 : 20 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <span className="section-label block mb-2">
                            {section?.label}
                        </span>
                        <h1 className="page-title text-bone">
                            {section?.title}
                        </h1>
                    </motion.div>

                    {/* Copy content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: showCopy ? 1 : 0, y: showCopy ? 0 : 20 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="body-copy mb-8"
                    >
                        {section?.copy.map((line, index) => (
                            <p key={index} className="mb-2">
                                {line}
                            </p>
                        ))}
                    </motion.div>

                    {/* Asset indicator */}
                    {assets.length > 1 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: showCopy ? 0.6 : 0 }}
                            transition={{ duration: 0.4 }}
                            className="flex items-center gap-2 mb-8"
                        >
                            {assets.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-8 h-px transition-colors duration-300 ${index === currentAssetIndex ? 'bg-neon-cyan' : 'bg-smoke'
                                        }`}
                                />
                            ))}
                            <span className="font-mono text-xs text-bone opacity-40 ml-2">
                                {currentAssetIndex + 1}/{assets.length}
                            </span>
                        </motion.div>
                    )}

                    {/* Navigation */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: showCopy ? 1 : 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                        className="flex items-center justify-between pointer-events-auto"
                    >
                        <Link
                            href={prevSection.route}
                            className="nav-link flex items-center gap-2"
                        >
                            <span className="text-neon-cyan">←</span>
                            <span className="hidden md:inline">{prevSection.title}</span>
                        </Link>

                        <Link
                            href="/"
                            className="nav-link"
                        >
                            Home
                        </Link>

                        <Link
                            href={nextSection.route}
                            className="nav-link flex items-center gap-2"
                        >
                            <span className="hidden md:inline">{nextSection.title}</span>
                            <span className="text-neon-cyan">→</span>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            {assets.length > 1 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: currentAssetIndex < assets.length - 1 ? 0.6 : 0 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
                >
                    <span className="font-mono text-xs text-bone">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-px h-4 bg-neon-cyan"
                    />
                </motion.div>
            )}

            {/* Gradient overlay */}
            <div className="fixed inset-0 z-5 pointer-events-none bg-gradient-to-t from-charcoal/90 via-transparent to-charcoal/30" />
        </div>
    );
}
