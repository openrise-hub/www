'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import * as BAS from 'three-bas';
import gsap from 'gsap';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

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

// Create animated text mesh
function createAnimatedTextMesh(geometry: THREE.BufferGeometry): THREE.Mesh {
  geometry.computeBoundingBox();
  const maxLength = geometry.boundingBox!.max.length();
  
  const positionAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
  const indexAttr = geometry.getIndex();
  const positions = positionAttr.array as Float32Array;
  const vertexCount = positionAttr.count;
  
  // Determine face count - if no index, every 3 vertices is a face
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
    // Non-indexed geometry: every 3 vertices is a triangle
    faceCount = vertexCount / 3;
    getVertexIndices = (faceIdx: number) => [
      faceIdx * 3,
      faceIdx * 3 + 1,
      faceIdx * 3 + 2
    ];
  }
  
  // Animation parameters
  const maxDelay = 0.0;
  const minDuration = 1.0;
  const maxDuration = 1.0;
  const stretch = 0.05;
  const lengthFactor = 0.001;
  const animationDuration = maxDuration + maxDelay + stretch + lengthFactor * maxLength;
  
  // Create buffer attributes for each vertex
  const aAnimation = new Float32Array(vertexCount * 2);
  const aEndPosition = new Float32Array(vertexCount * 3);
  const aAxisAngle = new Float32Array(vertexCount * 4);
  
  // Process each face
  for (let faceIdx = 0; faceIdx < faceCount; faceIdx++) {
    const [i0, i1, i2] = getVertexIndices(faceIdx);
    
    const centroid = computeCentroid(positions, i0, i1, i2);
    const centroidN = centroid.clone().normalize();
    
    // Animation timing
    const delay = (maxLength - centroid.length()) * lengthFactor;
    const duration = THREE.MathUtils.randFloat(minDuration, maxDuration);
    
    // End position - fibonacci sphere distribution
    const point = fibSpherePoint(faceIdx, faceCount, 200);
    
    // Axis angle for rotation
    const axis = new THREE.Vector3(centroidN.x, -centroidN.y, -centroidN.z).normalize();
    const angle = Math.PI * THREE.MathUtils.randFloat(0.5, 2.0);
    
    // Apply to all 3 vertices of this face
    for (const vertIdx of [i0, i1, i2]) {
      // Animation (delay, duration)
      aAnimation[vertIdx * 2] = delay + stretch * Math.random();
      aAnimation[vertIdx * 2 + 1] = duration;
      
      // End position
      aEndPosition[vertIdx * 3] = point.x;
      aEndPosition[vertIdx * 3 + 1] = point.y;
      aEndPosition[vertIdx * 3 + 2] = point.z;
      
      // Axis angle
      aAxisAngle[vertIdx * 4] = axis.x;
      aAxisAngle[vertIdx * 4 + 1] = axis.y;
      aAxisAngle[vertIdx * 4 + 2] = axis.z;
      aAxisAngle[vertIdx * 4 + 3] = angle;
    }
  }
  
  // Add attributes to geometry
  geometry.setAttribute('aAnimation', new THREE.BufferAttribute(aAnimation, 2));
  geometry.setAttribute('aEndPosition', new THREE.BufferAttribute(aEndPosition, 3));
  geometry.setAttribute('aAxisAngle', new THREE.BufferAttribute(aAxisAngle, 4));
  
  // Create material with custom shaders
  const material = new BAS.PhongAnimationMaterial({
    flatShading: true,
    side: THREE.DoubleSide,
    transparent: true,
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
      'float tProgress = easeCubicOut(tTime, 0.0, 1.0, tDuration);'
    ],
    vertexPosition: [
      'transformed = mix(transformed, aEndPosition, tProgress);',
      'float angle = aAxisAngle.w * tProgress;',
      'vec4 tQuat = quatFromAxisAngle(aAxisAngle.xyz, angle);',
      'transformed = rotateVector(tQuat, transformed);'
    ],
    color: new THREE.Color(0xfcf7f8),
    specular: new THREE.Color(0xcccccc),
    shininess: 4
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  
  // Add animationDuration and animationProgress properties
  const meshWithAnimation = mesh as unknown as THREE.Mesh & { 
    animationDuration: number; 
    _animationProgress: number;
    animationProgress: number;
  };
  meshWithAnimation.animationDuration = animationDuration;
  meshWithAnimation._animationProgress = 0;
  
  Object.defineProperty(meshWithAnimation, 'animationProgress', {
    get() {
      return this._animationProgress;
    },
    set(v: number) {
      this._animationProgress = v;
      (this.material as THREE.ShaderMaterial & { uniforms: { uTime: { value: number } } }).uniforms.uTime.value = this.animationDuration * v;
    }
  });
  
  return meshWithAnimation;
}

export default function AnimatedText({ text = 'OPENRISE', className }: AnimatedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Convert text to array of lines
    const lines = Array.isArray(text) ? text : [text];

    // Scene setup
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      10,
      100000
    );
    camera.position.set(0, 0, 600);

    const renderer = new THREE.WebGLRenderer({
      antialias: window.devicePixelRatio === 1,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 0, 1);
    scene.add(light);
    
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    // Animation references
    let tl: gsap.core.Timeline | null = null;
    const textMeshes: THREE.Mesh[] = [];
    let animationId: number;
    
    // Group to hold all lines
    const textGroup = new THREE.Group();
    scene.add(textGroup);
    
    // Responsive scaling - considers both width and aspect ratio for tall screens (iPad portrait)
    const baseWidth = 1200;
    function updateScale() {
      const aspectRatio = container.clientWidth / container.clientHeight;
      // For tall screens (aspect ratio < 0.8), scale down further
      const aspectScale = aspectRatio < 0.8 ? 0.7 : aspectRatio < 1 ? 0.85 : 1;
      const widthScale = Math.min(1, container.clientWidth / baseWidth);
      const scale = widthScale * aspectScale;
      textGroup.scale.setScalar(scale);
    }

    // Load font and create text
    const fontLoader = new FontLoader();
    fontLoader.load('/fonts/helvetiker_bold.typeface.json', (font) => {
      const fontSize = 40;
      const lineHeight = fontSize * 1.3;
      const totalHeight = lines.length * lineHeight;
      
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
        
        // Center the geometry horizontally
        geometry.computeBoundingBox();
        const size = new THREE.Vector3();
        geometry.boundingBox!.getSize(size);
        geometry.translate(-size.x / 2, 0, -size.z / 2);

        const mesh = createAnimatedTextMesh(geometry);
        
        // Position vertically - center all lines as a group
        const yOffset = (totalHeight / 2) - (lineIndex * lineHeight) - (lineHeight / 2);
        mesh.position.y = yOffset;
        
        textMeshes.push(mesh);
        textGroup.add(mesh);
      });
      
      // Apply initial scale
      updateScale();

      // GSAP timeline
      tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 0.5,
        yoyo: true
      });

      // Animate all meshes together
      textMeshes.forEach((mesh) => {
        tl!.fromTo(mesh, {
          animationProgress: 0.0
        }, {
          animationProgress: 0.6,
          duration: 4,
          ease: 'power1.inOut'
        }, 0);
      });

      tl.fromTo(textGroup.rotation, {
        y: 0
      }, {
        y: Math.PI * 2,
        duration: 4,
        ease: 'power1.inOut'
      }, 0);
    }, undefined, (error) => {
      console.error('Error loading font:', error);
    });

    // Render loop
    function animate() {
      animationId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    function handleResize() {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      updateScale();
    }
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      
      if (tl) tl.kill();
      
      textMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
      
      scene.remove(textGroup);
      
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [text]);

  return <div ref={containerRef} className={`w-full h-full ${className || ''}`} />;
}
