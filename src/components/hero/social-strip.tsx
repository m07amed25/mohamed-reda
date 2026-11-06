import { motion, stagger, useReducedMotion } from "motion/react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa6";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { contactHref } from "./contact";

const socials = [
  {
    label: "GitHub",
    icon: <FaGithub />,
    href: "https://github.com/m07amed25",
  },
  {
    label: "LinkedIn",
    icon: <FaLinkedin />,
    href: "https://www.linkedin.com/in/mhmd-reda-ali/",
  },
  {
    label: "Instagram",
    icon: <FaInstagram />,
    href: "https://www.instagram.com/m07amedr/",
  },
  {
    label: "Email",
    icon: <MdOutlineAlternateEmail />,
    href: contactHref,
  },
];

const SocialLinks = () => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.ul
      initial={reduceMotion ? false : "entering"}
      animate="ready"
      variants={{
        ready: {
          transition: { delayChildren: stagger(0.12, { startDelay: 0.16 }) },
        },
      }}
      className="flex list-none flex-col gap-1"
    >
      {socials.map((social) => {
        const opensNewTab = social.href.startsWith("https://");

        return (
          <motion.li
            key={social.label}
            variants={{
              entering: { opacity: 0.5, scale: 0.85 },
              ready: {
                opacity: 1,
                scale: 1,
                transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            <motion.a
              href={social.href}
              aria-label={social.label}
              target={opensNewTab ? "_blank" : "_self"}
              rel={opensNewTab ? "noopener noreferrer" : undefined}
              whileHover={reduceMotion ? undefined : { scale: 1.1 }}
              whileTap={reduceMotion ? undefined : { scale: 0.94 }}
              transition={{ type: "spring", stiffness: 450, damping: 28 }}
              className="grid size-11 place-items-center rounded-full text-lg text-white/80 hover:bg-white/10 hover:text-green-400 active:text-green-400 focus-visible:text-green-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400 motion-safe:transition-colors"
            >
              <span aria-hidden="true">{social.icon}</span>
            </motion.a>
          </motion.li>
        );
      })}
    </motion.ul>
  );
};

export const SocialStrip = () => {
  const reduceMotion = useReducedMotion();
  return (
    <nav
      aria-label="Social links"
      className="absolute inset-y-0 right-4 z-20 flex flex-col items-center justify-center gap-3 md:right-10"
    >
      <motion.span
        aria-hidden="true"
        initial={reduceMotion ? false : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="h-8 w-px origin-top bg-white/30"
      />
      <SocialLinks />
    </nav>
  );
};
