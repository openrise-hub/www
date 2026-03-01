'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

interface RingProps {
  font: Font;
  text: string;
  radius: number;
  fontSize: number;
  speed: number;
  index: number;
}

function TextRing({ font, text, radius, fontSize, speed, index }: RingProps) {
  const groupRef = useRef<THREE.Group>(null);
  const fullText = `${text} `;
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const idleRotation = state.clock.getElapsedTime() * 0.02 * speed;
    const direction = index % 2 === 0 ? 1 : -1;
    const scrollRotation = scrollY * 0.001 * speed;
    groupRef.current.rotation.z = (idleRotation + scrollRotation) * direction;
  });

  const charGeos = useMemo(() => {
    const uniqueChars = Array.from(new Set(fullText));
    const map: Record<string, THREE.BufferGeometry> = {};
    uniqueChars.forEach(char => {
      const geo = new TextGeometry(char, {
        font: font,
        size: fontSize,
        depth: 0.6,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.08,
        bevelSize: 0.03,
      });
      geo.center();
      map[char] = geo;
    });
    return map;
  }, [font, fullText, fontSize]);

  const items = useMemo(() => {
    const elements = [];
    const circumference = 2 * Math.PI * radius;
    const charWidth = fontSize * 0.85; 
    const totalCharsPossible = Math.floor(circumference / charWidth);
    const repeats = Math.max(1, Math.floor(totalCharsPossible / fullText.length));
    const totalCount = repeats * fullText.length;

    for (let i = 0; i < totalCount; i++) {
      const angle = (i / totalCount) * Math.PI * 2;
      const char = fullText[i % fullText.length];
      const geo = charGeos[char];
      
      // Alternate colors per repeat
      const repeatIndex = Math.floor(i / fullText.length);
      const color = repeatIndex % 2 === 0 ? "#fcf7f8" : "#6e8898"; // Foreground / Slate

      elements.push(
        <mesh 
          key={i} 
          geometry={geo}
          position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]} 
          rotation={[0, 0, angle + Math.PI / 2]}
        >
          <meshStandardMaterial 
            color={color}
            metalness={0.6} 
            roughness={0.4}
          />
        </mesh>
      );
    }
    return elements;
  }, [fullText, radius, fontSize, charGeos]);

  return <group ref={groupRef}>{items}</group>;
}

function CircularTextScene({ font, layers }: { font: Font; layers: number }) {
  const parallaxRef = useRef<THREE.Group>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMouse({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (parallaxRef.current) {
      const targetX = -mouse.y * 0.1;
      const targetY = mouse.x * 0.1;
      parallaxRef.current.rotation.x += (targetX - parallaxRef.current.rotation.x) * 0.05;
      parallaxRef.current.rotation.y += (targetY - parallaxRef.current.rotation.y) * 0.05;
    }
  });

  return (
    <group ref={parallaxRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        {Array.from({ length: layers }).map((_, i) => (
          <TextRing 
            key={i}
            font={font}
            text="THE GOAL" 
            radius={2.2 - i * 0.45} 
            fontSize={0.4 - i * 0.08} 
            speed={1 + i * 0.2} 
            index={i} 
          />
        ))}
      </Float>
    </group>
  );
}

export default function CircularText3D({ layers = 3 }: { layers?: number }) {
  const [font, setFont] = useState<Font | null>(null);

  useEffect(() => {
    const loader = new FontLoader();
    loader.load('/fonts/helvetiker_bold.typeface.json', (f) => setFont(f));
  }, []);

  if (!font) return null;

  return (
    <div className="w-full h-[400px] md:h-[600px] relative pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={1.2} />
        <pointLight position={[5, 5, 10]} intensity={30} color="#ffffff" />
        <pointLight position={[-5, -5, 10]} intensity={25} color="#ffffff" />
        <directionalLight position={[0, 0, 10]} intensity={2} />
        
        <CircularTextScene font={font} layers={layers} />
      </Canvas>
    </div>
  );
}
