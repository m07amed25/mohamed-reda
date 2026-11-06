import { motion } from "motion/react";

export const AvailabilityBadge = () => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="absolute z-10 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 pointer-events-none"
    style={{ top: "2.25rem" }}
  >
    <span className="relative flex h-1.5 w-1.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400"></span>
    </span>
    <span className="font-sans font-black text-[9px] tracking-[0.25rem] uppercase text-white">
      Available for work
    </span>
  </motion.div>
);
