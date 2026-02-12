'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, Float, Html, ContactShadows, useAnimations } from '@react-three/drei';
import { AnimatePresence } from 'framer-motion';
import { useSceneStore, Asset3D } from '@/store/useSceneStore';
import * as THREE from 'three';

// Loader component shown while 3D assets are loading
function Loader() {
    return (
        <Html center>
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
                <span className="font-mono text-xs text-bone opacity-60">Loading...</span>
            </div>
        </Html>
    );
}

// Individual 3D model component with advanced handling
interface ModelProps {
    asset: Asset3D;
    isActive: boolean;
}

function Model({ asset, isActive }: ModelProps) {
    const { scene, animations } = useGLTF(asset.path);
    const { ref, names, actions } = useAnimations(animations);
    const { viewport } = useThree();

    // Auto-scaling and centering logic
    useEffect(() => {
        if (ref.current) {
            // Compute bounding box
            const box = new THREE.Box3().setFromObject(ref.current);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            // Center the model
            ref.current.position.x += (ref.current.position.x - center.x);
            ref.current.position.y += (ref.current.position.y - center.y);
            ref.current.position.z += (ref.current.position.z - center.z);

            // Scale to fit viewport
            const maxDim = Math.max(size.x, size.y, size.z);
            const isMobile = viewport.width < 6;
            const targetSize = isMobile ? 2.5 : 3.5;
            const scale = targetSize / maxDim;
            ref.current.scale.setScalar(scale);
        }
    }, [ref, viewport.width]);

    // Play animations if they exist
    useEffect(() => {
        if (isActive && names.length > 0) {
            // Play all animations by default
            actions[names[0]]?.reset().fadeIn(0.5).play();
        }
        return () => {
            actions[names[0]]?.fadeOut(0.5);
        };
    }, [isActive, names, actions]);

    // Micro-rotation animation (≤0.2 rad/sec per spec)
    useFrame((state) => {
        if (ref.current && isActive) {
            // Subtle breathing/rotation
            ref.current.rotation.y += Math.sin(state.clock.elapsedTime * 0.1) * 0.001;
        }
    });

    // Cleanup logic is handled by Drei's useGLTF and React's lifecycle
    return (
        <group ref={ref} dispose={null}>
            <primitive object={scene} />
        </group>
    );
}

// Camera controller for smooth transitions
function CameraController() {
    const { camera } = useThree();
    const { activeAsset } = useSceneStore();

    useEffect(() => {
        if (activeAsset) {
            // Smoothly move camera to default position
            // In a real app we might want to animate this with gsap or framer-motion-3d
            camera.position.set(0, 0, 5);
            camera.lookAt(0, 0, 0);
        }
    }, [activeAsset, camera]);

    return null;
}

// Main Stage component
interface StageProps {
    className?: string;
    enableOrbit?: boolean;
}

function detectLowTierDevice() {
    if (typeof window === 'undefined') return false;

    const viewportWidth = window.innerWidth;
    const isSmallViewport = viewportWidth < 1024;
    const ua = navigator.userAgent.toLowerCase();
    const isMobileUA = /android|iphone|ipad|ipod|mobile|blackberry|opera mini|iemobile/.test(ua);
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const cores = navigator.hardwareConcurrency ?? 8;
    const isLowMemory = memory <= 4;
    const isLowCpu = cores <= 4;

    return isSmallViewport || isMobileUA || isLowMemory || isLowCpu;
}

export default function Stage({ className = '', enableOrbit = false }: StageProps) {
    const { activeAsset, isTransitioning, performanceMode } = useSceneStore();
    const [isAutoLowTier, setIsAutoLowTier] = useState(detectLowTierDevice);

    useEffect(() => {
        const frameId = window.requestAnimationFrame(() => {
            setIsAutoLowTier(detectLowTierDevice());
        });

        const handleResize = () => {
            setIsAutoLowTier(detectLowTierDevice());
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.cancelAnimationFrame(frameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const isLowTier = performanceMode || isAutoLowTier;
    const dprRange: [number, number] = isLowTier ? [1, 1.25] : [1, 2];
    const ambientIntensity = isLowTier ? 0.5 : 0.4;
    const spotIntensity = isLowTier ? 1.2 : 2;

    return (
        <div className={`w-full h-full ${className}`}>
            <Canvas
                shadows={!isLowTier}
                camera={{ position: [0, 0, 5], fov: 45 }}
                dpr={dprRange}
                gl={{
                    antialias: !isLowTier,
                    alpha: true,
                    powerPreference: isLowTier ? 'default' : 'high-performance',
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.2,
                }}
            >
                <CameraController />

                {/* Lighting setup for premium industrial feel */}
                <ambientLight intensity={ambientIntensity} />
                <spotLight
                    position={[10, 10, 10]}
                    angle={0.15}
                    penumbra={1}
                    intensity={spotIntensity}
                    castShadow={!isLowTier}
                />
                <pointLight
                    position={[-10, -10, -10]}
                    intensity={isLowTier ? 0.7 : 1}
                    color="#0FF"
                />

                {/* Secondary accent light */}
                {!isLowTier && (
                    <pointLight
                        position={[5, 0, 5]}
                        intensity={0.5}
                        color="#FF0"
                    />
                )}

                {/* Environment for physically based rendering reflections */}
                <Environment preset={isLowTier ? 'studio' : 'city'} />

                {/* Contact shadows for grounding objects */}
                {!isLowTier && (
                    <ContactShadows
                        position={[0, -1.5, 0]}
                        opacity={0.4}
                        scale={10}
                        blur={2.5}
                        far={4}
                    />
                )}

                {enableOrbit && (
                    <OrbitControls
                        enableDamping={true}
                        dampingFactor={0.05}
                        enableZoom={true}
                        minDistance={2}
                        maxDistance={10}
                        enablePan={false}
                        maxPolarAngle={Math.PI / 1.5}
                        minPolarAngle={Math.PI / 3}
                    />
                )}

                <Suspense fallback={<Loader />}>
                    <AnimatePresence mode="wait">
                        {activeAsset && !isTransitioning && (
                            <Float
                                speed={1.5}
                                rotationIntensity={0.2}
                                floatIntensity={0.5}
                                key={activeAsset.id}
                            >
                                <Model
                                    asset={activeAsset}
                                    isActive={true}
                                />
                            </Float>
                        )}
                    </AnimatePresence>
                </Suspense>
            </Canvas>
        </div>
    );
}

// Preload utility for assets
export function preloadAsset(path: string) {
    useGLTF.preload(path);
}
