'use client';

import { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float } from '@react-three/drei';
import * as THREE from 'three';

function Model({ mouse }: { mouse: { x: number; y: number } }) {
  const { scene } = useGLTF('/WhiteLogo3DThick.glb');
  const groupRef = useRef<THREE.Group>(null);

  const centeredScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.position.set(-21.333106, 21.333324, -3.33025);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshStandardMaterial({
          color: 0xfcf7f8,
          metalness: 0.85,
          roughness: 0.24,
        });
      }
    });
    return clone;
  }, [scene]);

  useFrame(() => {
    if (!groupRef.current) return;
    const targetY = 0.22 + mouse.x * 0.18;
    const targetX = 0.14 - mouse.y * 0.18;
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.08;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.08;
  });

  return (
    <group ref={groupRef} rotation={[0.14, 0.22, 0]}>
      <group scale={1.85 / 42.666}>
        <primitive object={centeredScene} />
      </group>
    </group>
  );
}

useGLTF.preload('/WhiteLogo3DThick.glb');

export default function Contact3DLogo() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      setMouse({
        x: Math.max(-1.5, Math.min(1.5, x)),
        y: Math.max(-1.5, Math.min(1.5, y)),
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 flex flex-col items-center justify-center select-none"
    >
      <div className="w-full h-full">
        <Canvas
          camera={{ position: [0, 0, 4.3], fov: 32 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
        >
          <ambientLight intensity={1.3} />
          <directionalLight position={[5, 7, 5]} intensity={2.2} />
          <pointLight position={[-5, -3, 3]} intensity={16} color="#f9e900" />
          <pointLight position={[5, 3, 3]} intensity={22} color="#ffffff" />
          <pointLight position={[0, -4, -2]} intensity={8} color="#6e8898" />

          <Float speed={1.5} rotationIntensity={0.12} floatIntensity={0.2}>
            <Suspense fallback={null}>
              <Model mouse={mouse} />
            </Suspense>
          </Float>
        </Canvas>
      </div>
    </div>
  );
}
