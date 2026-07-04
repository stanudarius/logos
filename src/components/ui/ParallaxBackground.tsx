import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

export const ParallaxBackground = () => {
  const motionX = useMotionValue(0);
  const motionY = useMotionValue(0);
  const smoothX = useSpring(motionX, { damping: 40, stiffness: 150 });
  const smoothY = useSpring(motionY, { damping: 40, stiffness: 150 });

  const transform = useTransform(
    [smoothX, smoothY],
    ([x, y]) => `translate3d(${x}px, ${y}px, 0) scale(1.05)`
  );

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
      style={{ transform }}
      className="bg-noise absolute inset-0 opacity-[0.035] pointer-events-none"
    />
  );
};
