'use client';

import { Canvas } from '@react-three/fiber';
import { Preload, View } from '@react-three/drei';
import { ReactNode, useRef } from 'react';

/**
 * GlobalCanvas provides a single shared WebGL context for the entire site.
 * 
 * Pattern:
 * - This component wraps the page content (children).
 * - A fixed <Canvas> sits behind everything with <View.Port />.
 * - Individual components place <View> inline in the DOM.
 * - View.Port picks them up and renders into the shared canvas.
 */
export default function GlobalCanvas({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      {children}
      <Canvas
        eventSource={containerRef as React.RefObject<HTMLDivElement>}
        eventPrefix="client"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop="always"
      >
        <View.Port />
        <Preload all />
      </Canvas>
    </div>
  );
}
