'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { ScrollData } from './LogoBlackHole';

interface RingData {
  text: string;
  radius: number;
  fontSize: number;
  depth: number;
  speed: number;
  direction: number;
}

const RINGS: RingData[] = [
  {
    text: 'BUILD • MENTOR • SCALE • ',
    radius: 1.15,
    fontSize: 0.046,
    depth: 0.003,
    speed: 0.75,
    direction: 1,
  },
  {
    text: 'OPEN SOURCE COLLECTIVE • USEFUL TOOLS • ',
    radius: 1.72,
    fontSize: 0.048,
    depth: 0.003,
    speed: 0.52,
    direction: -1,
  },
  {
    text: 'OPENRISE • BY DEVELOPERS FOR DEVELOPERS • ',
    radius: 2.38,
    fontSize: 0.050,
    depth: 0.003,
    speed: 0.35,
    direction: 1,
  },
];

function buildMergedRingGeometries(
  font: Font,
  text: string,
  radius: number,
  fontSize: number,
  depth: number
): { whiteGeo: THREE.BufferGeometry | null; yellowGeo: THREE.BufferGeometry | null } {
  const fullText = text.trim() + ' ';
  const circumference = 2 * Math.PI * radius;
  const charWidth = fontSize * 0.84;
  const totalChars = Math.floor(circumference / charWidth);
  const repeats = Math.max(1, Math.floor(totalChars / fullText.length));
  const totalCount = repeats * fullText.length;

  const whiteGeos: THREE.BufferGeometry[] = [];
  const yellowGeos: THREE.BufferGeometry[] = [];

  for (let i = 0; i < totalCount; i++) {
    const char = fullText[i % fullText.length];
    if (char === ' ') continue;

    const angle = (i / totalCount) * Math.PI * 2;
    const repeatIdx = Math.floor(i / fullText.length);
    const isYellow = repeatIdx % 2 === 1;

    const charGeo = new TextGeometry(char, {
      font,
      size: fontSize,
      depth,
      curveSegments: 5,
      bevelEnabled: false,
    });

    charGeo.center();
    charGeo.rotateZ(angle + Math.PI / 2);
    charGeo.translate(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);

    if (isYellow) {
      yellowGeos.push(charGeo);
    } else {
      whiteGeos.push(charGeo);
    }
  }

  const whiteGeo = whiteGeos.length > 0 ? mergeGeometries(whiteGeos) : null;
  const yellowGeo = yellowGeos.length > 0 ? mergeGeometries(yellowGeos) : null;

  return { whiteGeo, yellowGeo };
}

function SingleRing({
  font,
  data,
  scrollDataRef,
}: {
  font: Font;
  data: RingData;
  scrollDataRef?: React.MutableRefObject<ScrollData>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const whiteMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const yellowMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const { whiteGeo, yellowGeo } = useMemo(() => {
    return buildMergedRingGeometries(font, data.text, data.radius, data.fontSize, data.depth);
  }, [font, data]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.z = t * 0.05 * data.speed * data.direction;

    const dissolve = scrollDataRef?.current?.heroDissolve ?? 0;
    const stage = scrollDataRef?.current?.activeStage ?? 0;
    const factor = stage > 0 ? 1.0 : THREE.MathUtils.lerp(0.32, 1.0, Math.min(1, dissolve * 1.6));

    if (whiteMatRef.current) {
      whiteMatRef.current.opacity = 0.92 * factor;
      whiteMatRef.current.emissiveIntensity = 0.22 * factor;
    }
    if (yellowMatRef.current) {
      yellowMatRef.current.opacity = 0.95 * factor;
      yellowMatRef.current.emissiveIntensity = 0.35 * factor;
    }
  });

  return (
    <group ref={groupRef}>
      {whiteGeo && (
        <mesh geometry={whiteGeo}>
          <meshStandardMaterial
            ref={whiteMatRef}
            color="#fcf7f8"
            metalness={0.75}
            roughness={0.25}
            emissive="#fcf7f8"
            emissiveIntensity={0.07}
            transparent
            opacity={0.30}
          />
        </mesh>
      )}
      {yellowGeo && (
        <mesh geometry={yellowGeo}>
          <meshStandardMaterial
            ref={yellowMatRef}
            color="#f9e900"
            metalness={0.75}
            roughness={0.25}
            emissive="#f9e900"
            emissiveIntensity={0.11}
            transparent
            opacity={0.32}
          />
        </mesh>
      )}
    </group>
  );
}

interface AccretionRingsProps {
  scrollDataRef?: React.MutableRefObject<ScrollData>;
}

export default function AccretionRings({ scrollDataRef }: AccretionRingsProps) {
  const [font, setFont] = useState<Font | null>(null);

  useEffect(() => {
    const loader = new FontLoader();
    loader.load(
      '/fonts/helvetiker_bold.typeface.json',
      (f) => setFont(f),
      undefined,
      (err) => console.error('Failed to load font for AccretionRings:', err)
    );
  }, []);

  if (!font) return null;

  return (
    <group position={[0, 0, -0.05]}>
      {RINGS.map((ring, idx) => (
        <SingleRing key={idx} font={font} data={ring} scrollDataRef={scrollDataRef} />
      ))}
    </group>
  );
}
