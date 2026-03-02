'use client';

import { useRef, useEffect, useMemo, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { View, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import * as BAS from 'three-bas';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import type { Font } from 'three/examples/jsm/loaders/FontLoader.js';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedTextProps {
  text?: string | string[];
  className?: string;
}

// Fibonacci sphere point distribution
function fibSpherePoint(i: number, n: number, radius: number) {
  const G = Math.PI * (3 - Math.sqrt(5));
  const step = 2.0 / n;
  
  const y = i * step - 1 + (step * 0.5);
  const r = Math.sqrt(1 - y * y);
  const phi = i * G;
  const x = Math.cos(phi) * r;
  const z = Math.sin(phi) * r;
  
  return {
    x: x * radius,
    y: y * radius,
    z: z * radius
  };
}

// Compute centroid of a triangle from positions
function computeCentroid(positions: Float32Array, i0: number, i1: number, i2: number): THREE.Vector3 {
  return new THREE.Vector3(
    (positions[i0 * 3] + positions[i1 * 3] + positions[i2 * 3]) / 3,
    (positions[i0 * 3 + 1] + positions[i1 * 3 + 1] + positions[i2 * 3 + 1]) / 3,
    (positions[i0 * 3 + 2] + positions[i1 * 3 + 2] + positions[i2 * 3 + 2]) / 3
  );
}

// Interface for BAS Material Parameters
interface BASMaterialParams extends THREE.ShaderMaterialParameters {
  flatShading?: boolean;
  vertexFunctions?: string[];
  vertexParameters?: string[];
  vertexInit?: string[];
  vertexPosition?: string[];
  vertexNormal?: string[];
  diffuse?: THREE.Color;
  specular?: THREE.Color;
  shininess?: number;
}

// Interface for the resulting material
interface BASMaterial extends THREE.ShaderMaterial {
  uniforms: {
    uTime: THREE.IUniform<number>;
    [key: string]: THREE.IUniform<unknown>;
  };
}

// Interface for the animated mesh
interface AnimatedMesh extends THREE.Mesh<THREE.BufferGeometry, BASMaterial> {
  animationDuration: number;
  _animationProgress: number;
  animationProgress: number;
}

// Create animated text mesh using BAS
function createAnimatedTextMesh(geometry: THREE.BufferGeometry): AnimatedMesh {
  geometry.computeBoundingBox();
  const maxLength = geometry.boundingBox!.max.length();
  
  const positionAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
  const indexAttr = geometry.getIndex();
  const positions = positionAttr.array as Float32Array;
  const vertexCount = positionAttr.count;
  
  let faceCount: number;
  let getVertexIndices: (faceIdx: number) => [number, number, number];
  
  if (indexAttr) {
    const indices = indexAttr.array;
    faceCount = indices.length / 3;
    getVertexIndices = (faceIdx: number) => [
      indices[faceIdx * 3],
      indices[faceIdx * 3 + 1],
      indices[faceIdx * 3 + 2]
    ];
  } else {
    faceCount = vertexCount / 3;
    getVertexIndices = (faceIdx: number) => [
      faceIdx * 3,
      faceIdx * 3 + 1,
      faceIdx * 3 + 2
    ];
  }
  
  const maxDelay = 0.0;
  const minDuration = 1.0;
  const maxDuration = 1.0;
  const stretch = 0.05;
  const lengthFactor = 0.001; 
  const animationDuration = maxDuration + maxDelay + stretch + lengthFactor * maxLength;
  
  const aAnimation = new Float32Array(vertexCount * 2);
  const aEndPosition = new Float32Array(vertexCount * 3);
  const aAxisAngle = new Float32Array(vertexCount * 4);
  
  for (let faceIdx = 0; faceIdx < faceCount; faceIdx++) {
    const [i0, i1, i2] = getVertexIndices(faceIdx);
    
    const centroid = computeCentroid(positions, i0, i1, i2);
    const centroidN = centroid.clone().normalize();
    
    const delay = (maxLength - centroid.length()) * lengthFactor;
    const duration = THREE.MathUtils.randFloat(minDuration, maxDuration);
    
    const point = fibSpherePoint(faceIdx, faceCount, 200);
    
    let axis = new THREE.Vector3(centroidN.x, -centroidN.y, -centroidN.z);
    if (axis.lengthSq() < 0.0001) axis.set(0, 1, 0);
    axis = axis.normalize();
    
    const angle = Math.PI * THREE.MathUtils.randFloat(0.5, 2.0);
    
    for (const vertIdx of [i0, i1, i2]) {
      aAnimation[vertIdx * 2] = delay + stretch * Math.random();
      aAnimation[vertIdx * 2 + 1] = duration;
      
      aEndPosition[vertIdx * 3] = point.x;
      aEndPosition[vertIdx * 3 + 1] = point.y;
      aEndPosition[vertIdx * 3 + 2] = point.z;
      
      aAxisAngle[vertIdx * 4] = axis.x;
      aAxisAngle[vertIdx * 4 + 1] = axis.y;
      aAxisAngle[vertIdx * 4 + 2] = axis.z;
      aAxisAngle[vertIdx * 4 + 3] = angle;
    }
  }
  
  geometry.setAttribute('aAnimation', new THREE.BufferAttribute(aAnimation, 2));
  geometry.setAttribute('aEndPosition', new THREE.BufferAttribute(aEndPosition, 3));
  geometry.setAttribute('aAxisAngle', new THREE.BufferAttribute(aAxisAngle, 4));
  
  const materialProps: BASMaterialParams = {
    flatShading: true,
    side: THREE.DoubleSide,
    transparent: false, 
    uniforms: {
      uTime: { value: 0 }
    },
    vertexFunctions: [
      BAS.ShaderChunk['cubic_bezier'],
      BAS.ShaderChunk['ease_cubic_out'],
      BAS.ShaderChunk['quaternion_rotation']
    ],
    vertexParameters: [
      'uniform float uTime;',
      'attribute vec2 aAnimation;',
      'attribute vec3 aEndPosition;',
      'attribute vec4 aAxisAngle;'
    ],
    vertexInit: [
      'float tDelay = aAnimation.x;',
      'float tDuration = aAnimation.y;',
      'float tTime = clamp(uTime - tDelay, 0.0, tDuration);',
      'float tProgress = easeCubicOut(tTime, 0.0, 1.0, tDuration);',
      'float angle = aAxisAngle.w * tProgress;',
      'vec4 tQuat = quatFromAxisAngle(aAxisAngle.xyz, angle);'
    ],
    vertexPosition: [
      'transformed = mix(transformed, aEndPosition, tProgress);',
      'transformed = rotateVector(tQuat, transformed);'
    ],
    vertexNormal: [
      'objectNormal = rotateVector(tQuat, objectNormal);' 
    ],
    diffuse: new THREE.Color(0x6e8898),
    specular: new THREE.Color(0x111111),
    shininess: 10 
  };

  const material = new BAS.PhongAnimationMaterial(materialProps as unknown as THREE.ShaderMaterialParameters) as BASMaterial;

  const mesh = new THREE.Mesh(geometry, material) as unknown as AnimatedMesh;
  mesh.frustumCulled = false;
  
  mesh.animationDuration = animationDuration;
  mesh._animationProgress = 0;
  
  Object.defineProperty(mesh, 'animationProgress', {
    get(this: AnimatedMesh) {
      return this._animationProgress;
    },
    set(this: AnimatedMesh, v: number) {
      this._animationProgress = v;
      this.material.uniforms.uTime.value = this.animationDuration * v;
    }
  });
  
  return mesh;
}

function AnimatedTextScene({ text }: { text: string | string[] }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshesRef = useRef<AnimatedMesh[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const { size } = useThree();
  const [font, setFont] = useState<Font | null>(null);

  useEffect(() => {
    const loader = new FontLoader();
    loader.load('/fonts/helvetiker_bold.typeface.json', (f) => setFont(f));
  }, []);

  useEffect(() => {
    if (!font || !groupRef.current) return;

    const lines = Array.isArray(text) ? text : [text];
    const fontSize = 40; 
    const lineHeight = fontSize * 1.3;
    const totalHeight = lines.length * lineHeight;
    const textMeshes: AnimatedMesh[] = [];

    while (groupRef.current.children.length > 0) {
      const child = groupRef.current.children[0];
      groupRef.current.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        (child.material as THREE.Material).dispose();
      }
    }

    lines.forEach((lineText, lineIndex) => {
      const geometry = new TextGeometry(lineText, {
        font,
        size: fontSize,
        depth: 12,
        curveSegments: 24,
        bevelEnabled: true,
        bevelSize: 2,
        bevelThickness: 2
      });

      geometry.computeBoundingBox();
      const geoSize = new THREE.Vector3();
      geometry.boundingBox!.getSize(geoSize);
      geometry.translate(-geoSize.x / 2, 0, -geoSize.z / 2);

      const mesh = createAnimatedTextMesh(geometry);
      const yOffset = (totalHeight / 2) - (lineIndex * lineHeight) - (lineHeight / 2);
      mesh.position.y = yOffset;

      textMeshes.push(mesh);
      groupRef.current!.add(mesh);
    });

    meshesRef.current = textMeshes;

    return () => {
      textMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
    };
  }, [font, text]);

  useEffect(() => {
    if (meshesRef.current.length === 0) return;
    const heroSection = document.querySelector('#animated-text-trigger');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection || document.body,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      }
    });

    meshesRef.current.forEach((mesh) => {
      tl.fromTo(mesh, {
        animationProgress: 0.0
      }, {
        animationProgress: 0.6,
        ease: 'none'
      }, 0);
    });

    tlRef.current = tl;

    return () => {
      if (tlRef.current) {
        if (tlRef.current.scrollTrigger) tlRef.current.scrollTrigger.kill();
        tlRef.current.kill();
      }
    };
  }, [font]);

  useEffect(() => {
    if (!groupRef.current) return;
    const baseWidth = 1200; 
    const viewportWidth = size.width;
    const viewportHeight = size.height;
    const targetFillRatio = viewportHeight > viewportWidth ? (viewportWidth < 600 ? 0.95 : 0.65) : 0.90;
    const targetWidth = viewportWidth * targetFillRatio;
    const scale = targetWidth / baseWidth;
    groupRef.current.scale.setScalar(scale);
  }, [size]);

  return (
    <>
      <ambientLight intensity={1.5} />
      <pointLight position={[300, 300, 600]} intensity={30} color="#ffffff" />
      <pointLight position={[-300, -300, 600]} intensity={25} color="#ffffff" />
      <directionalLight position={[0, 0, 600]} intensity={2} />
      <group ref={groupRef} />
    </>
  );
}

export default function AnimatedText({ text = 'OPENRISE', className }: AnimatedTextProps) {
  return (
    <div id="animated-text-trigger" className={`w-full h-full ${className || ''}`}>
      <View className="w-full h-full">
        <PerspectiveCamera makeDefault position={[0, 0, 600]} fov={60} near={10} far={100000} />
        <AnimatedTextScene text={text} />
      </View>
    </div>
  );
}