'use client';

import { useFrame } from '@react-three/fiber';
import { useGLTF, Float, Stage, Center, View, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

function Model() {
  const { scene } = useGLTF('/WhiteLogo3DThick.glb');
  return <primitive object={scene} />;
}

function Scene() {
  const rotationRef = useRef<THREE.Group>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const baseRotationX = 0.15;
  const baseRotationY = 0.2;

  const parallaxStrength = 0.15;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = - (e.clientY / window.innerHeight) * 2 + 1;
      setMouse({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (rotationRef.current) {
      const targetY = baseRotationY + mouse.x * parallaxStrength;
      const targetX = baseRotationX - mouse.y * parallaxStrength;

      rotationRef.current.rotation.y += (targetY - rotationRef.current.rotation.y) * 0.05;
      rotationRef.current.rotation.x += (targetX - rotationRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <Stage environment="city" intensity={0.5} shadows={false}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <group ref={rotationRef} rotation={[baseRotationX, baseRotationY, 0]}>
          <Center>
            <Model />
          </Center>
        </group>
      </Float>
    </Stage>
  );
}

export default function Logo3D() {
  return (
    <div className="w-full aspect-square max-w-xs md:max-w-sm lg:max-w-lg">
      <View className="w-full h-full">
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={35} />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </View>
    </div>
  );
}
