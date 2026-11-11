import { motion } from "motion/react";
import { StarsBackground } from "@/components/animate-ui/backgrounds/stars";
import { AvailabilityBadge } from "./availability-badge";
import { MobileContactCTA, SpinningCTA } from "./contact-cta";
import { CubeSculpture } from "./cube-sculpture";
import { HeroHeading } from "./hero-heading";
import { SocialStrip } from "./social-strip";

export const Hero = () => (
  <section className="relative z-20">
    <StarsBackground
      className="flex min-h-dvh flex-col pl-6 pr-20 pt-24 pb-[max(2.5rem,env(safe-area-inset-bottom))] md:pl-10 md:pr-28"
      pointerEvents={false}
    >
      <AvailabilityBadge />
      <SocialStrip />
      <div className="z-10 mt-auto mb-6 md:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-fit"
        >
          <MobileContactCTA />
          <HeroHeading />
        </motion.div>
      </div>

      <div className="z-10 grid grid-cols-1 md:grid-cols-12 w-full gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="col-span-1 md:col-span-5 lg:col-span-4"
        >
          <div className="w-12 h-[2px] bg-white mb-6 md:hidden"></div>
          <p className="font-sans text-xs md:text-sm font-medium text-white leading-relaxed tracking-wide uppercase text-left">
            Building digital experiences that are not only visually captivating
            but also functionally robust. I specialize in crafting seamless user
            interfaces and intuitive interactions, ensuring that every project I
            undertake is both aesthetically pleasing and highly usable.
          </p>
        </motion.div>
      </div>
      <CubeSculpture />
      <SpinningCTA />
    </StarsBackground>
  </section>
);
