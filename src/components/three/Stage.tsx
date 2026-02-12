'use client';

import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, Float, Html, ContactShadows, useAnimations } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
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
    const { ref, mixer, names, actions } = useAnimations(animations);
    const groupRef = useRef<THREE.Group>(null);
    const { viewport } = useThree();

    // Auto-scaling and centering logic
    useEffect(() => {
        if (ref.current) {
            // Compute bounding box
            const box = new THREE.Box3().setFromObject(ref.current);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            const focusTarget = asset.target
                ? new THREE.Vector3(...asset.target)
                : center;

            // Center the model using metadata target when provided
            ref.current.position.x += (ref.current.position.x - focusTarget.x);
            ref.current.position.y += (ref.current.position.y - focusTarget.y);
            ref.current.position.z += (ref.current.position.z - focusTarget.z);

            // Scale to fit viewport with optional metadata multiplier
            const maxDim = Math.max(size.x, size.y, size.z);
            const isMobile = viewport.width < 6;
            const targetSize = isMobile ? 2.5 : 3.5;
            const metadataScale = asset.scaleMultiplier ?? 1;
            const scale = (targetSize / maxDim) * metadataScale;
            ref.current.scale.setScalar(scale);
        }
    }, [asset.scaleMultiplier, asset.target, ref, viewport.width]);

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
            const [x, y, z] = activeAsset.cameraPosition ?? [0, 0, 5];
            const [targetX, targetY, targetZ] = activeAsset.target ?? [0, 0, 0];

            // Smoothly move camera to asset-specific/default position
            // In a real app we might want to animate this with gsap or framer-motion-3d
            camera.position.set(x, y, z);
            camera.lookAt(targetX, targetY, targetZ);
        }
    }, [activeAsset, camera]);

    return null;
}

// Main Stage component
interface StageProps {
    className?: string;
    enableOrbit?: boolean;
}

export default function Stage({ className = '', enableOrbit = false }: StageProps) {
    const { activeAsset, isTransitioning } = useSceneStore();

    return (
        <div className={`w-full h-full ${className}`}>
            <Canvas
                shadows
                camera={{ position: [0, 0, 5], fov: 45 }}
                dpr={[1, 2]}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.2,
                }}
            >
                <CameraController />

                {/* Lighting setup for premium industrial feel */}
                <ambientLight intensity={0.4} />
                <spotLight
                    position={[10, 10, 10]}
                    angle={0.15}
                    penumbra={1}
                    intensity={2}
                    castShadow
                />
                <pointLight
                    position={[-10, -10, -10]}
                    intensity={1}
                    color="#0FF"
                />

                {/* Secondary accent light */}
                <pointLight
                    position={[5, 0, 5]}
                    intensity={0.5}
                    color="#FF0"
                />

                {/* Environment for physically based rendering reflections */}
                <Environment preset="city" />

                {/* Contact shadows for grounding objects */}
                <ContactShadows
                    position={[0, -1.5, 0]}
                    opacity={0.4}
                    scale={10}
                    blur={2.5}
                    far={4}
                />

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
