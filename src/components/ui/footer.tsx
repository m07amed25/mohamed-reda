import type { MouseEvent } from "react";
import { useLenis } from "lenis/react";
import { ArrowUp, Heart, Mail } from "lucide-react";
import { contactHref, socialLinks } from "@/components/hero/contact";
import { projectLinks } from "@/lib/project-links";
import "./footer.css";

const pageLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

const footerProjects = [
  { label: "Code Catch", ...projectLinks.codeCatch },
  { label: "Rawad", ...projectLinks.rawad },
];

const iconLinks = [
  { label: "Email", href: contactHref, icon: Mail },
  ...socialLinks.filter(({ label }) => label !== "Email"),
];

const focus = " focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--footer-accent)";
const iconControl = "grid size-11 place-items-center border border-dotted border-(--footer-rule) hover:border-(--footer-accent) hover:text-(--footer-accent) motion-safe:transition-colors" + focus;
const navHeading = "mb-1 font-sans text-sm font-semibold text-(--footer-text)";
const navLink = "inline-flex min-h-9 items-center rounded-sm text-xs text-(--footer-muted) hover:text-(--footer-text) hover:underline" + focus;

export function Footer() {
  const lenis = useLenis();

  function scrollToTop(event: MouseEvent<HTMLAnchorElement>) {
    if (!lenis || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const top = document.getElementById("top");
    if (!top) return;

    event.preventDefault();
    if (window.location.hash !== "#top") {
      window.history.pushState(window.history.state, "", "#top");
    }
    top.focus({ preventScroll: true });
    lenis.scrollTo(0);
  }

  return (
    <footer className="portfolio-footer relative z-20 bg-(--footer-bg) px-6 py-12 font-sans text-(--footer-text) sm:px-10 md:py-[5.75rem]">
      <div className="mx-auto max-w-[67rem] border-y border-(--footer-rule)">
        <div className="mx-1 sm:mx-8">
          <div className="flex min-h-36 flex-col items-center gap-4 py-8 text-center sm:flex-row sm:gap-7 sm:px-4 sm:text-left">
            <a href="#top" aria-label="Mohamed Reda, back to top" className={"shrink-0 rounded-sm text-4xl leading-none font-black tracking-tight text-(--footer-accent)" + focus}>
              <span aria-hidden="true">M</span>
            </a>
            <p className="text-xs leading-[1.45] text-(--footer-intro)">
              I’m Mohamed Reda, a freelance full-stack web developer. I work across the front end and back end, with a particular interest in how people navigate and interact with web applications. My selected work includes Code Catch, an AI code review platform, and Rawad, an Arabic exam platform built with accessibility in mind. If you have a project in mind, tell me what you’re building and who it’s for.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-5 gap-y-5 border-y border-dotted border-(--footer-rule) py-6 sm:grid-cols-[1fr_1.25fr_1fr] sm:gap-x-10">
            <div>
              <h2 className={navHeading}>Explore</h2>
              <ul>
                {pageLinks.map(({ label, href }) => (
                  <li key={href}>
                    <a href={href} className={navLink}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className={navHeading}>Projects</h2>
              <ul>
                {footerProjects.map(({ label, live, source }) => (
                  <li key={live} className="flex flex-wrap items-center gap-x-2.5">
                    <a href={live} className={navLink}>{label}</a>
                    <span aria-hidden="true" className="size-0.5 rounded-full bg-(--footer-muted)" />
                    <a href={source} aria-label={label + " source"} className={navLink}>Source</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h2 className={navHeading}>Connect</h2>
              <ul className="grid grid-cols-2 gap-x-3">
                {socialLinks.map(({ label, href }) => (
                  <li key={href}>
                    <a href={href} className={navLink}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 py-8 md:pt-10">
          <nav aria-label="Footer social links">
            <ul className="flex flex-wrap justify-center gap-3 sm:gap-6">
              {iconLinks.map(({ label, href, icon: Icon }) => {
                const external = href.startsWith("https://");

                return (
                  <li key={href}>
                    <a
                      href={href}
                      aria-label={label}
                      title={label}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className={iconControl + " rounded-xl"}
                    >
                      <Icon aria-hidden="true" className="size-[17px]" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <a href="#top" onClick={scrollToTop} aria-label="Back to top" title="Back to top" className={iconControl + " rounded-full"}>
            <ArrowUp aria-hidden="true" className="size-4" strokeWidth={1.5} />
          </a>
        </div>

        <p className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 px-4 pb-9 text-center text-xs text-(--footer-muted)">
          <span>© {new Date().getFullYear()} Made with</span>
          <Heart aria-hidden="true" className="size-4 fill-rose-600 text-rose-600" />
          <span>by <span className="font-semibold text-(--footer-text)">Mohamed Reda</span></span>
        </p>
      </div>
    </footer>
  );
}
