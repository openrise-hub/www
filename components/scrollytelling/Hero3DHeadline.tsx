'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import * as BAS from 'three-bas';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import type { ScrollData } from './LogoBlackHole';

interface BASMaterial extends THREE.ShaderMaterial {
  uniforms: {
    uTime: THREE.IUniform<number>;
    uDissolve: THREE.IUniform<number>;
    [key: string]: THREE.IUniform<unknown>;
  };
}

interface AnimatedMesh extends THREE.Mesh<THREE.BufferGeometry, BASMaterial> {
  animationDuration: number;
  _animationProgress: number;
  animationProgress: number;
}

function createAnimatedTextMesh(
  geometry: THREE.BufferGeometry,
  diffuseColor: string | number = 0xfcf7f8,
  flatShading = true
): AnimatedMesh {
  const positionAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
  const indexAttr = geometry.getIndex();
  const vertexCount = positionAttr.count;

  let faceCount: number;
  let getVertexIndices: (faceIdx: number) => [number, number, number];

  if (indexAttr) {
    const indices = indexAttr.array;
    faceCount = indices.length / 3;
    getVertexIndices = (faceIdx: number) => [
      indices[faceIdx * 3],
      indices[faceIdx * 3 + 1],
      indices[faceIdx * 3 + 2],
    ];
  } else {
    faceCount = vertexCount / 3;
    getVertexIndices = (faceIdx: number) => [faceIdx * 3, faceIdx * 3 + 1, faceIdx * 3 + 2];
  }

  const aAnimation = new Float32Array(vertexCount * 2);
  const aDisplacement = new Float32Array(vertexCount * 3);
  const aCentroid = new Float32Array(vertexCount * 3);
  const aDrift = new Float32Array(vertexCount * 3);

  const animationDuration = 1.0;

  for (let faceIdx = 0; faceIdx < faceCount; faceIdx++) {
    const [i0, i1, i2] = getVertexIndices(faceIdx);

    const delay = THREE.MathUtils.randFloat(0, 0.15);
    const duration = THREE.MathUtils.randFloat(0.4, 0.7);

    const dx = THREE.MathUtils.randFloatSpread(0.025);
    const dy = THREE.MathUtils.randFloat(0.005, 0.025);
    const dz = THREE.MathUtils.randFloatSpread(0.02);

    const cx = (positionAttr.getX(i0) + positionAttr.getX(i1) + positionAttr.getX(i2)) / 3;
    const cy = (positionAttr.getY(i0) + positionAttr.getY(i1) + positionAttr.getY(i2)) / 3;
    const cz = (positionAttr.getZ(i0) + positionAttr.getZ(i1) + positionAttr.getZ(i2)) / 3;

    const driftX = THREE.MathUtils.randFloatSpread(0.02);
    const driftY = THREE.MathUtils.randFloat(0.005, 0.025);
    const driftZ = THREE.MathUtils.randFloatSpread(0.015);

    for (const vertIdx of [i0, i1, i2]) {
      aAnimation[vertIdx * 2] = delay;
      aAnimation[vertIdx * 2 + 1] = duration;

      aDisplacement[vertIdx * 3] = dx;
      aDisplacement[vertIdx * 3 + 1] = dy;
      aDisplacement[vertIdx * 3 + 2] = dz;

      aCentroid[vertIdx * 3] = cx;
      aCentroid[vertIdx * 3 + 1] = cy;
      aCentroid[vertIdx * 3 + 2] = cz;

      aDrift[vertIdx * 3] = driftX;
      aDrift[vertIdx * 3 + 1] = driftY;
      aDrift[vertIdx * 3 + 2] = driftZ;
    }
  }

  geometry.setAttribute('aAnimation', new THREE.BufferAttribute(aAnimation, 2));
  geometry.setAttribute('aDisplacement', new THREE.BufferAttribute(aDisplacement, 3));
  geometry.setAttribute('aCentroid', new THREE.BufferAttribute(aCentroid, 3));
  geometry.setAttribute('aDrift', new THREE.BufferAttribute(aDrift, 3));

  const materialProps = {
    flatShading,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1.0,
    uniforms: {
      uTime: { value: 0 },
      uDissolve: { value: 0 },
    },
    vertexFunctions: [
      BAS.ShaderChunk['ease_cubic_out'],
    ],
    vertexParameters: [
      'uniform float uTime;',
      'uniform float uDissolve;',
      'attribute vec2 aAnimation;',
      'attribute vec3 aDisplacement;',
      'attribute vec3 aCentroid;',
      'attribute vec3 aDrift;',
    ],
    vertexInit: [
      'float tProgress = 0.0;',
      'if (uTime > 0.0001) {',
      '  float tDelay = aAnimation.x;',
      '  float tDuration = aAnimation.y;',
      '  float tTime = clamp(uTime - tDelay, 0.0, tDuration);',
      '  tProgress = easeCubicOut(tTime, 0.0, 1.0, tDuration);',
      '}',
      'float finishPhase = smoothstep(0.88, 1.0, uDissolve);',
      'float shrink = clamp(1.0 - pow(finishPhase, 1.6), 0.0, 1.0);',
    ],
    vertexPosition: [
      'vec3 toVertex = transformed - aCentroid;',
      'transformed = aCentroid + (toVertex + aDisplacement * tProgress) * shrink + aDrift * pow(finishPhase, 1.3);',
    ],
    diffuse: new THREE.Color(diffuseColor),
    specular: new THREE.Color(0x222222),
    shininess: 20,
  };

  const material = new BAS.PhongAnimationMaterial(
    materialProps as unknown as THREE.ShaderMaterialParameters
  ) as BASMaterial;

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
      this.material.uniforms.uDissolve.value = v;
      const fadeStart = 0.90;
      if (v < fadeStart) {
        this.material.opacity = 1.0;
      } else {
        const fadeProgress = (v - fadeStart) / (1.0 - fadeStart);
        this.material.opacity = Math.max(0.0, 1.0 - Math.pow(fadeProgress, 1.4));
      }
    },
  });

  return mesh;
}

interface Hero3DHeadlineProps {
  scrollDataRef?: React.MutableRefObject<ScrollData>;
}

export default function Hero3DHeadline({ scrollDataRef }: Hero3DHeadlineProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshesRef = useRef<AnimatedMesh[]>([]);
  const [font, setFont] = useState<Font | null>(null);
  const { size } = useThree();

  useEffect(() => {
    const loader = new FontLoader();
    loader.load(
      '/fonts/helvetiker_bold.typeface.json',
      (f) => setFont(f),
      undefined,
      (err) => console.error('Failed to load font for Hero3DHeadline:', err)
    );
  }, []);

  useEffect(() => {
    if (!font || !groupRef.current) return;

    while (groupRef.current.children.length > 0) {
      const child = groupRef.current.children[0];
      groupRef.current.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        (child.material as THREE.Material).dispose();
      }
    }

    const fontSize = 0.17;
    const depth = 0.0012;
    const textMeshes: AnimatedMesh[] = [];

    const line1Geo = new TextGeometry('Build Useful Tools.', {
      font,
      size: fontSize,
      depth,
      curveSegments: 8,
      bevelEnabled: false,
    });
    line1Geo.computeBoundingBox();
    const l1Min = line1Geo.boundingBox!.min;
    const l1Max = line1Geo.boundingBox!.max;
    const l1Width = l1Max.x - l1Min.x;
    line1Geo.translate(-l1Min.x - l1Width / 2, -l1Min.y, -depth / 2);

    const line1Mesh = createAnimatedTextMesh(line1Geo, 0xfcf7f8, true);
    line1Mesh.position.y = 0.13;
    textMeshes.push(line1Mesh);
    groupRef.current.add(line1Mesh);

    const empowerGeo = new TextGeometry('Empower', {
      font,
      size: fontSize,
      depth,
      curveSegments: 8,
      bevelEnabled: false,
    });
    empowerGeo.computeBoundingBox();
    const empMin = empowerGeo.boundingBox!.min;
    const empMax = empowerGeo.boundingBox!.max;
    const empWidth = empMax.x - empMin.x;

    const openSourceGeo = new TextGeometry('Open Source.', {
      font,
      size: fontSize,
      depth,
      curveSegments: 8,
      bevelEnabled: false,
    });
    openSourceGeo.computeBoundingBox();
    const osMin = openSourceGeo.boundingBox!.min;
    const osMax = openSourceGeo.boundingBox!.max;
    const osWidth = osMax.x - osMin.x;

    const spaceWidth = 0.095;
    const totalLine2Width = empWidth + spaceWidth + osWidth;
    const startX = -totalLine2Width / 2;

    empowerGeo.translate(-empMin.x + startX, -empMin.y, -depth / 2);
    empowerGeo.computeBoundingBox();
    const empBounds = empowerGeo.boundingBox!;

    const empowerMesh = createAnimatedTextMesh(empowerGeo, 0xf9e900, true);
    empowerMesh.position.y = -0.13;
    textMeshes.push(empowerMesh);
    groupRef.current.add(empowerMesh);

    openSourceGeo.translate(-osMin.x + startX + empWidth + spaceWidth, -osMin.y, -depth / 2);
    const osMesh = createAnimatedTextMesh(openSourceGeo, 0xfcf7f8, true);
    osMesh.position.y = -0.13;
    textMeshes.push(osMesh);
    groupRef.current.add(osMesh);

    const p0 = new THREE.Vector3(empBounds.min.x + 0.01, 0.008, 0.01);
    const p1 = new THREE.Vector3((empBounds.min.x + empBounds.max.x) * 0.5, 0.020, 0.01);
    const p2 = new THREE.Vector3(empBounds.max.x - 0.01, 0.008, 0.01);
    const curve = new THREE.QuadraticBezierCurve3(p0, p1, p2);
    const underlineGeo = new THREE.TubeGeometry(curve, 32, 0.0042, 8, false);
    const underlineMesh = createAnimatedTextMesh(underlineGeo, 0xf9e900, false);
    underlineMesh.position.y = -0.13;
    textMeshes.push(underlineMesh);
    groupRef.current.add(underlineMesh);

    meshesRef.current = textMeshes;

    return () => {
      textMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
    };
  }, [font]);

  const syncWithSlot = useCallback(() => {
    if (!groupRef.current) return;
    const slotEl = document.getElementById('hero-3d-slot');
    const dist = 4.5;
    const frustumH = 2 * Math.tan((35 * Math.PI / 180) / 2) * dist;
    const frustumW = frustumH * (size.width / size.height);

    let posY = 0.02;
    const targetWidth3D = frustumW * (size.width < 768 ? 0.88 : 0.62);
    const scaleByWidth = targetWidth3D / 2.50;
    let finalScale = scaleByWidth;

    if (slotEl) {
      const rect = slotEl.getBoundingClientRect();
      const screenCenterY = window.innerHeight / 2;
      const slotCenterY = rect.top + rect.height / 2;
      const offsetPixelsY = -(slotCenterY - screenCenterY);
      posY = (offsetPixelsY / window.innerHeight) * frustumH;

      const slotH3D = (rect.height / window.innerHeight) * frustumH;
      const scaleByHeight = (slotH3D * 0.78) / 0.42;
      finalScale = Math.min(scaleByWidth, scaleByHeight);
    }

    groupRef.current.position.set(0, posY - 0.056 * finalScale, 0.5);
    groupRef.current.scale.setScalar(finalScale);
  }, [size]);

  useEffect(() => {
    syncWithSlot();
    window.addEventListener('resize', syncWithSlot);
    return () => window.removeEventListener('resize', syncWithSlot);
  }, [syncWithSlot]);

  useFrame(() => {
    if (meshesRef.current.length === 0) return;
    const dissolve = scrollDataRef?.current?.heroDissolve ?? 0;

    if (groupRef.current) {
      groupRef.current.visible = dissolve < 1.0;
    }

    if (dissolve < 1.0) {
      syncWithSlot();
      meshesRef.current.forEach((mesh) => {
        mesh.animationProgress = dissolve;
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.05, 0.5]} />
  );
}
