'use client';

import { Canvas, useFrame, extend } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

// Extend Three.js with ShaderMaterial if needed (though it's standard)
extend({ ShaderMaterial: THREE.ShaderMaterial });

const GrainMaterial = {
    uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0.05 },
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform float uTime;
    uniform float uOpacity;
    varying vec2 vUv;

    float random(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      float noise = random(vUv + uTime);
      gl_FragColor = vec4(vec3(noise), uOpacity);
    }
  `,
};

function Grain() {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                ref={materialRef}
                {...GrainMaterial}
                transparent
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
}

export default function GrainShader() {
    return (
        <div className="grain-overlay">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Grain />
            </Canvas>
        </div>
    );
}
