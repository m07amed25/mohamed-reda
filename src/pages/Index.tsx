import { useEffect, useRef } from "react";
import {
  motion,
  useSpring,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";

export { Mail } from "lucide-react";
export {
  FaGithub as Github,
  FaInstagram as Instagram,
  FaLinkedin as Linkedin,
} from "react-icons/fa6";

const CursorFollower = () => {
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

const BrandLogo = () => (
  <div className="fixed top-6 left-6 md:top-8 md:left-10 z-50 mix-blend-difference">
    <h1 className="m-0! font-sans! font-black! text-2xl! md:text-4xl! tracking-tighter! text-white! flex items-start">
      Mohamed
      <span className="text-xs md:text-lg font-medium ml-1 -mt-1 md:-mt-2">
        &copy;
      </span>
    </h1>
  </div>
);

const Index = () => {
  const footerContainer = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: footerContainer,
    offset: ["start end", "end end"],
  });

  const footerY = useTransform(scrollYProgress, [0, 1], ["-50%", "0%"]);

  return (
    <div className="min-h-screen relative bg-black selection:bg-white selection:text-black">
      <BrandLogo />
      <CursorFollower />
    </div>
  );
};

export default Index;
