'use client';

import { Suspense, useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float } from '@react-three/drei';
import * as THREE from 'three';
import AccretionRings from './AccretionRings';

export interface ScrollData {
  progress: number;
  activeStage: number;
  heroDissolve: number;
  finaleDive: number;
}

interface LogoBlackHoleProps {
  scrollDataRef?: React.MutableRefObject<ScrollData>;
}

function Model() {
  const { scene } = useGLTF('/WhiteLogo3DThick.glb');
  
  const centeredScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.position.set(-21.333106, 21.333324, -3.33025);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshStandardMaterial({
          color: 0xfcf7f8,
          metalness: 0.82,
          roughness: 0.2,
        });
      }
    });
    return clone;
  }, [scene]);

  return <primitive object={centeredScene} />;
}

useGLTF.preload('/WhiteLogo3DThick.glb');

export default function LogoBlackHole({ scrollDataRef }: LogoBlackHoleProps) {
  const logoGroupRef = useRef<THREE.Group>(null);
  const ringsGroupRef = useRef<THREE.Group>(null);
  const positionRef = useRef<THREE.Group>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const baseRotationX = 0.12;
  const baseRotationY = 0.18;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMouse({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (!positionRef.current) return;

    const stage = scrollDataRef?.current?.activeStage ?? 0;
    const finaleDive = scrollDataRef?.current?.finaleDive ?? 0;

    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;
    let targetScale = 1.0;

    switch (stage) {
      case 0:
        targetX = 0;
        targetY = 0.05;
        targetZ = 0;
        targetScale = 1.0;
        break;
      case 1:
        targetX = 0;
        targetY = 0;
        targetZ = 0;
        targetScale = 0.88;
        break;
      case 2:
        targetX = 1.35;
        targetY = 0;
        targetZ = 0;
        targetScale = 0.95;
        break;
      case 3:
        targetX = 0;
        targetY = 0;
        targetZ = 0;
        targetScale = 0.88;
        break;
      case 4:
        targetX = -1.35;
        targetY = 0;
        targetZ = 0;
        targetScale = 0.95;
        break;
      case 5:
        targetX = 0;
        targetY = 0;
        targetZ = 0;
        targetScale = 0.82;
        break;
      case 6:
      default:
        targetX = 0;
        targetY = 0;
        targetScale = 1.0 + finaleDive * 3.5;
        targetZ = finaleDive * 3.6;
        break;
    }

    positionRef.current.position.x += (targetX - positionRef.current.position.x) * 0.08;
    positionRef.current.position.y += (targetY - positionRef.current.position.y) * 0.08;
    positionRef.current.position.z += (targetZ - positionRef.current.position.z) * 0.08;

    const currentScale = positionRef.current.scale.x;
    const nextScale = currentScale + (targetScale - currentScale) * 0.08;
    positionRef.current.scale.set(nextScale, nextScale, nextScale);

    if (logoGroupRef.current) {
      const targetLogoY = baseRotationY + mouse.x * 0.042;
      const targetLogoX = baseRotationX - mouse.y * 0.042;
      logoGroupRef.current.rotation.y += (targetLogoY - logoGroupRef.current.rotation.y) * 0.06;
      logoGroupRef.current.rotation.x += (targetLogoX - logoGroupRef.current.rotation.x) * 0.06;
      logoGroupRef.current.position.x += (mouse.x * 0.016 - logoGroupRef.current.position.x) * 0.06;
      logoGroupRef.current.position.y += (mouse.y * 0.016 - logoGroupRef.current.position.y) * 0.06;
    }

    if (ringsGroupRef.current) {
      const targetRingsY = baseRotationY + mouse.x * 0.17;
      const targetRingsX = baseRotationX - mouse.y * 0.17;
      ringsGroupRef.current.rotation.y += (targetRingsY - ringsGroupRef.current.rotation.y) * 0.06;
      ringsGroupRef.current.rotation.x += (targetRingsX - ringsGroupRef.current.rotation.x) * 0.06;
      ringsGroupRef.current.position.x += (mouse.x * 0.075 - ringsGroupRef.current.position.x) * 0.06;
      ringsGroupRef.current.position.y += (mouse.y * 0.075 - ringsGroupRef.current.position.y) * 0.06;
    }
  });

  return (
    <group ref={positionRef}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 8, 6]} intensity={2.2} />
      <pointLight position={[-6, -4, 4]} intensity={24} color="#f9e900" />
      <pointLight position={[6, 4, 4]} intensity={30} color="#ffffff" />
      <pointLight position={[0, -5, -2]} intensity={12} color="#6e8898" />

      <Float speed={1.4} rotationIntensity={0.1} floatIntensity={0.2}>
        <group>
          <group ref={logoGroupRef} rotation={[baseRotationX, baseRotationY, 0]}>
            <group scale={1.75 / 42.666}>
              <Suspense fallback={null}>
                <Model />
              </Suspense>
            </group>
          </group>

          <group ref={ringsGroupRef} rotation={[baseRotationX, baseRotationY, 0]}>
            <AccretionRings scrollDataRef={scrollDataRef} />
          </group>
        </group>
      </Float>
    </group>
  );
}
