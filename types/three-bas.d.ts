declare module 'three-bas' {
  import * as THREE from 'three';

  export class ModelBufferGeometry extends THREE.BufferGeometry {
    constructor(model: THREE.BufferGeometry);
    faceCount: number;
    createAttribute(name: string, itemSize: number): THREE.BufferAttribute;
  }

  export class PhongAnimationMaterial extends THREE.ShaderMaterial {
    constructor(parameters: {
      flatShading?: boolean;
      side?: THREE.Side;
      transparent?: boolean;
      uniforms?: Record<string, { value: unknown }>;
      uniformValues?: Record<string, unknown>;
      vertexFunctions?: string[];
      vertexParameters?: string[];
      vertexInit?: string[];
      vertexPosition?: string[];
      color?: THREE.Color;
      specular?: THREE.Color;
      shininess?: number;
    });
    uniforms: Record<string, { value: unknown }>;
  }

  export const Utils: {
    tessellateRepeat(geometry: THREE.BufferGeometry, maxEdgeLength: number, iterations: number): void;
    separateFaces(geometry: THREE.BufferGeometry): void;
    computeCentroid(geometry: THREE.BufferGeometry, face: { a: number; b: number; c: number }): THREE.Vector3;
  };

  export const ShaderChunk: Record<string, string>;
}
