'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSceneStore, ASSET_REGISTRY } from '@/store/useSceneStore';
import { HOMEPAGE_COPY, SECTIONS } from '@/data/sections';
import Navigation from '@/components/layout/Navigation';

// Dynamic import Stage to avoid SSR issues with Three.js
const Stage = dynamic(() => import('@/components/three/Stage'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

const Preloader = dynamic(() => import('@/components/three/Preloader'), {
  ssr: false,
});

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const { transitionToAsset, setCurrentSection } = useSceneStore();

  useEffect(() => {
    if (isLoaded) {
      // Set homepage asset after preloader completes
      const homepageAsset = ASSET_REGISTRY.homepage[0];
      transitionToAsset(homepageAsset);
      setCurrentSection('homepage');

      // Delay content reveal for dramatic effect
      const timer = setTimeout(() => setShowContent(true), 800);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, transitionToAsset, setCurrentSection]);

  const handlePreloadComplete = () => {
    setIsLoaded(true);
  };

  return (
    <>
      {/* Preloader */}
      {!isLoaded && <Preloader onComplete={handlePreloadComplete} />}

      {/* Main content */}
      <div className="relative min-h-screen w-full overflow-hidden bg-charcoal">
        {/* Navigation */}
        <Navigation />

        {/* 3D Environment - Full Screen */}
        <div className="fixed inset-0 z-0">
          <Stage enableOrbit={true} />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 min-h-screen flex flex-col justify-between pointer-events-none">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="flex-1 flex items-center justify-center px-6 md:px-12"
          >
            <div className="max-w-3xl text-center">
              <h1 className="font-sans text-3xl md:text-5xl lg:text-6xl font-bold text-bone leading-tight mb-6">
                {HOMEPAGE_COPY.hero}
              </h1>
              <p className="font-mono text-sm md:text-base text-bone opacity-60">
                {HOMEPAGE_COPY.supporting}
              </p>
            </div>
          </motion.div>

          {/* Bottom Section - Navigation prompt */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="p-6 md:p-12"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* CTA */}
              <Link
                href="/altered-state"
                className="pointer-events-auto group flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-bone hover:text-neon-cyan transition-colors duration-300"
              >
                <span>{HOMEPAGE_COPY.cta}</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-neon-cyan"
                >
                  →
                </motion.span>
              </Link>

              {/* Quick links */}
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 pointer-events-auto">
                {SECTIONS.slice(0, 3).map((section) => (
                  <Link
                    key={section.id}
                    href={section.route}
                    className="nav-link text-xs"
                  >
                    {section.title}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative gradient overlay */}
        <div className="fixed inset-0 z-5 pointer-events-none bg-gradient-to-t from-charcoal/80 via-transparent to-charcoal/40" />
      </div>
    </>
  );
}
