'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSceneStore, ASSET_REGISTRY } from '@/store/useSceneStore';
import { preloadAsset } from './Stage';

interface PreloaderProps {
    onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [failedAssets, setFailedAssets] = useState<Array<{ id: string; path: string; error: string }>>([]);
    const { setLoading, setCurrentSection } = useSceneStore();

    useEffect(() => {
        let isMounted = true;

        const preloadAllAssets = async () => {
            // Get all asset paths
            const allAssets = Object.values(ASSET_REGISTRY).flat();
            const totalAssets = allAssets.length;
            let loadedCount = 0;

            // Preload each asset sequentially to avoid GPU overload
            for (const asset of allAssets) {
                const result = await preloadAsset(asset.path);

                if (!isMounted) {
                    return;
                }

                if (!result.ok) {
                    const errorMessage = result.error?.message ?? 'Unknown preload error';
                    const failure = { id: asset.id, path: asset.path, error: errorMessage };

                    console.error(
                        `[Preloader] Failed to preload asset id="${asset.id}" path="${asset.path}" after ${result.attempts} attempts`,
                        result.error
                    );

                    setFailedAssets((previous) => [...previous, failure]);
                }

                loadedCount++;
                setProgress(Math.round((loadedCount / totalAssets) * 100));

                // Small delay between loads for smoother experience
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            if (!isMounted) {
                return;
            }

            // Complete loading
            setIsComplete(true);
            setLoading(false, 100);

            // Wait for exit animation then call onComplete
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (!isMounted) {
                return;
            }

            setCurrentSection('homepage');
            onComplete();
        };

        preloadAllAssets();

        return () => {
            isMounted = false;
        };
    }, [onComplete, setLoading, setCurrentSection]);

    return (
        <AnimatePresence>
            {!isComplete && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-charcoal"
                >
                    {/* Loader content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col items-center gap-8 px-6"
                    >
                        {/* Logo / Title */}
                        <h1 className="font-sans text-2xl md:text-4xl font-bold text-bone tracking-tight">
                            Luffy World
                        </h1>

                        {/* Loading text */}
                        <p className="font-mono text-sm text-bone opacity-60 loader-pulse text-center">
                            Assembling memory. Rendering presence.
                        </p>

                        {/* Progress bar */}
                        <div className="w-48 md:w-64 h-px bg-smoke overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className="h-full bg-neon-cyan"
                            />
                        </div>

                        {/* Progress percentage */}
                        <span className="font-mono text-xs text-bone opacity-40">
                            {progress}%
                        </span>

                        {failedAssets.length > 0 && (
                            <div className="max-w-md text-left border border-red-500/30 bg-red-900/20 p-3 rounded-sm">
                                <p className="font-mono text-[10px] uppercase tracking-wide text-red-200 mb-2">
                                    Some assets failed to preload ({failedAssets.length})
                                </p>
                                <ul className="space-y-1">
                                    {failedAssets.map((asset) => (
                                        <li key={asset.id} className="font-mono text-[10px] text-red-100 break-all">
                                            <span className="text-red-300">{asset.id}</span>: {asset.path} ({asset.error})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </motion.div>

                    {/* Decorative elements */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.1 }}
                        transition={{ duration: 2, delay: 0.5 }}
                        className="absolute bottom-8 left-8 font-mono text-xs text-bone"
                    >
                        Loading fragments of a life.
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
