import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export const ParallaxBackground = () => {
  const motionX = useMotionValue(0);
  const motionY = useMotionValue(0);
  const smoothX = useSpring(motionX, { damping: 40, stiffness: 150 });
  const smoothY = useSpring(motionY, { damping: 40, stiffness: 150 });

  useEffect(() => {
    let ticking = false;
    let rAF: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        rAF = requestAnimationFrame(() => {
          const x = (e.clientX / window.innerWidth - 0.5) * 20;
          const y = (e.clientY / window.innerHeight - 0.5) * 20;
          motionX.set(x);
          motionY.set(y);
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      if (!ticking) {
        rAF = requestAnimationFrame(() => {
          const x = Math.min(Math.max(e.gamma! / 4.5, -10), 10);
          const y = Math.min(Math.max((e.beta! - 45) / 4.5, -10), 10);
          motionX.set(x);
          motionY.set(y);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleDeviceOrientation, { passive: true });
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
        window.removeEventListener("deviceorientation", handleDeviceOrientation);
      }
      cancelAnimationFrame(rAF);
    };
  }, [motionX, motionY]);

  return (
    <motion.div
      id="parallax-bg"
      style={{
        x: smoothX,
        y: smoothY,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
      }}
      className="absolute inset-0 opacity-[0.035] pointer-events-none scale-[1.05]"
    />
  );
};
