import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export const CursorFollower = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(1);
  const springConfig = { damping: 20, stiffness: 100, mass: 0.8 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX - 12);
      mouseY.set(e.clientY - 12);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] h-6 w-6 rounded-full bg-gray-400/50 opacity-80 mix-blend-difference pointer-events-none hidden lg:block backdrop-blur-[1px]"
      style={{ x, y }}
    />
  );
};
