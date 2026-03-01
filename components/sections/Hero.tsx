'use client';

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Logo3D from "../ui/3DLogo";
import AnimatedText from "../ui/AnimatedText";
import { ScrollIndicator } from "../ui";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current, 
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: "power2.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-[calc(100dvh-4rem)] w-full opacity-0">
      <div className="absolute inset-0 flex items-center justify-center">
        <Logo3D />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <AnimatedText text={["HELPFUL SOLUTIONS FOR THE", "OPEN SOURCE COMMUNITY."]} />
      </div>
      <ScrollIndicator className="cursor-target" />
    </section>
  );
}


