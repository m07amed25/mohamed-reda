import { useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const About = () => {
  const [vh, setVh] = useState(
    typeof window !== "undefined" ? window.innerHeight : 800,
  );

  useEffect(() => {
    const updateVh = () => setVh(window.innerHeight);
    updateVh();
    window.addEventListener("resize", updateVh);
    return () => window.removeEventListener("resize", updateVh);
  }, []);

  const { scrollY } = useScroll();

  const y1 = useTransform(scrollY, [0, vh * 0.4], [80, 0]);
  const opacity1 = useTransform(scrollY, [0, vh * 0.3], [0, 1]);

  const y2 = useTransform(scrollY, [vh * 0.1, vh * 0.5], [80, 0]);
  const opacity2 = useTransform(scrollY, [vh * 0.1, vh * 0.4], [0, 1]);

  const y3 = useTransform(scrollY, [vh * 0.2, vh * 0.5], [80, 0]);
  const opacity3 = useTransform(scrollY, [vh * 0.2, vh * 0.5], [0, 1]);

  const y4 = useTransform(scrollY, [vh * 0.3, vh * 0.6], [80, 0]);
  const opacity4 = useTransform(scrollY, [vh * 0.3, vh * 0.6], [0, 1]);

  return (
    <section
      id="about"
      className="sticky bottom-0 z-0 min-h-dvh w-full bg-white text-black font-sans px-6 py-12 md:px-12 lg:px-16 overflow-hidden flex items-center justify-center"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-8 md:gap-x-12 w-full max-w-[1600px] mx-auto">
        <motion.div
          className="md:col-span-3 lg:col-span-3 pt-2"
          style={{ y: y1, opacity: opacity1 }}
        >
          <h2 className="font-sans text-xs md:text-sm font-bold uppercase tracking-widest">
            Background & Data
          </h2>
        </motion.div>
        <div className="md:col-span-9 lg:col-span-9 flex flex-col gap-10 md:gap-12">
          <motion.div
            className="flex flex-col gap-2"
            style={{ y: y2, opacity: opacity2 }}
          >
            <h3 className="font-sans text-xs md:text-sm font-bold uppercase tracking-wide opacity-100 mb-1">
              01. Education
            </h3>
            <div className="flex flex-col">
              <p className="font-sans text-xl md:text-2xl lg:text-3xl font-bold leading-tight tracking-tight">
                Faculty of Computer and Information Technology, Mansoura
                Univercity
              </p>
              <p className="font-sans text-xl md:text-2xl lg:text-3xl font-normal text-black/70 leading-tight tracking-tight">
                B.Sc. in Computer Science (2022 - 2026)
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col gap-2"
            style={{ y: y3, opacity: opacity3 }}
          >
            <h3 className="font-sans text-xs md:text-sm font-bold uppercase tracking-wide opacity-100 mb-1">
              02. Experience
            </h3>
            <div className="flex flex-col gap-6">
              <div className="">
                <p className="font-sans text-xl md:text-2xl lg:text-3xl font-bold leading-tight tracking-tight">
                  Frontend Developer Intern at Omnexa
                </p>
                <p className="font-sans text-xl md:text-2xl lg:text-3xl font-normal text-black/70 leading-tight tracking-tight">
                  July 2026 - October 2026
                </p>
              </div>
              <div>
                <p className="font-sans text-xl md:text-2xl lg:text-3xl font-bold leading-tight tracking-tight">
                  Freelance Full-Stack Web Developer
                </p>
                <p className="font-sans text-xl md:text-2xl lg:text-3xl font-normal text-black/70 leading-tight tracking-tight">
                  July 2025 - Present
                </p>
              </div>
            </div>
          </motion.div>

          {/* 0.3. Foucs */}
          <motion.div
            className="flex flex-col gap-2"
            style={{ y: y4, opacity: opacity4 }}
          >
            <h3 className="font-sans text-xs md:text-sm font-bold uppercase tracking-wide opacity-100 mb-1">
              03. Focus
            </h3>
            <ul className="flex flex-col">
              <li className="font-sans text-xl md:text-2xl lg:text-3xl font-bold leading-tight tracking-tight">
                Software Engineering Architecture
              </li>
              <li className="font-sans text-xl md:text-2xl lg:text-3xl font-bold leading-tight tracking-tight">
                Artificial Intelligence & Process Automation
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
