import type { MouseEvent, ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

if (typeof window !== "undefined") gsap.registerPlugin(CustomEase);

const demoLinks = [
  { label: "About us", href: "#about" },
  { label: "Our work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Blog", href: "#blog" },
  { label: "Contact us", href: "#contact" },
];

function MenuIcon({ close = false }: { close?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      className={close ? "kinetic-close-icon" : undefined}
    >
      <path fill="currentColor" d="M7.33 0h1.34v16H7.33zM0 7.33h16v1.34H0z" />
    </svg>
  );
}

type MenuLink = { label: string; href: string };

export function Component({
  links = demoLinks,
  contactLinks = [],
}: {
  links?: readonly (MenuLink & { number?: string })[];
  contactLinks?: readonly (MenuLink & { icon?: ReactNode })[];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const pendingHash = useRef<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const lenis = useLenis();
  useEffect(() => {
    return () => {
      timelineRef.current?.revert();
      timelineRef.current = null;
    };
  }, []);

  const close = () => {
    const timeline = timelineRef.current;
    if (
      timeline &&
      timeline.progress() > 0 &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      timeline.reverse();
    } else {
      dialogRef.current?.close();
    }
  };

  const followNavLink = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;

    const { hash } = event.currentTarget;
    if (
      event.currentTarget.getAttribute("href")?.startsWith("#") &&
      document.getElementById(hash.slice(1))
    ) {
      event.preventDefault();
      pendingHash.current = hash;
    }
    close();
  };

  const open = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;

    dialog.showModal();
    setExpanded(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timelineRef.current?.progress(1).pause();
      return;
    }

    if (!timelineRef.current) {
      const ease = CustomEase.create("sterlingGate", "0.65, 0.01, 0.05, 0.99");
      timelineRef.current = gsap
        .timeline({
          paused: true,
          defaults: { ease, duration: 0.7 },
          onReverseComplete: () => dialog.close(),
        })
        .fromTo(
          dialog.querySelector(".kinetic-overlay"),
          { opacity: 0 },
          { opacity: 1 },
          0,
        )
        .fromTo(
          dialog.querySelectorAll(".kinetic-layer"),
          { xPercent: 101 },
          { xPercent: 0, stagger: 0.12, duration: 0.575 },
          0,
        )
        .fromTo(
          dialog.querySelector(".kinetic-toggle-labels"),
          { yPercent: 0 },
          { yPercent: -50 },
          0,
        )
        .fromTo(
          dialog.querySelector(".kinetic-close-icon"),
          { rotate: 0 },
          { rotate: 315 },
          0,
        )
        .addLabel("sheetOpen")
        .to(
          dialog.querySelectorAll(".kinetic-links, .kinetic-contact"),
          { autoAlpha: 1, duration: 0.3 },
          "sheetOpen",
        )
        .fromTo(
          dialog.querySelectorAll(".kinetic-link-text"),
          { yPercent: 140, rotate: 10 },
          { yPercent: 0, rotate: 0, stagger: 0.05 },
          "sheetOpen",
        );
      const contactItems = dialog.querySelectorAll(".kinetic-contact li");
      if (contactItems.length) {
        timelineRef.current.fromTo(
          contactItems,
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.32,
            stagger: 0.05,
            ease: "power2.out",
          },
          "sheetOpen+=0.18",
        );
      }
    }
    timelineRef.current.play(0);
  };

  return (
    <div className="kinetic-navigation">
      <button
        ref={triggerRef}
        type="button"
        className="kinetic-toggle"
        onClick={open}
        aria-haspopup="dialog"
        aria-expanded={expanded}
        aria-controls={id}
      >
        Menu <MenuIcon />
      </button>
      <dialog
        ref={dialogRef}
        id={id}
        className="kinetic-dialog"
        aria-label="Site navigation"
        data-lenis-prevent
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClose={() => {
          setExpanded(false);
          triggerRef.current?.focus({ preventScroll: true });
          const hash = pendingHash.current;
          pendingHash.current = null;
          const target = hash && document.getElementById(hash.slice(1));
          if (!target) return;

          if (window.location.hash !== hash) {
            window.history.pushState(window.history.state, "", hash);
          }
          if (lenis) {
            lenis.scrollTo(target);
          } else {
            const reducedMotion = window.matchMedia(
              "(prefers-reduced-motion: reduce)",
            ).matches;
            target.scrollIntoView({
              behavior: reducedMotion ? "instant" : "smooth",
            });
          }
        }}
      >
        <div className="kinetic-overlay" onClick={close} aria-hidden="true" />
        <div className="kinetic-panel">
          <div className="kinetic-layer" aria-hidden="true" />
          <div className="kinetic-layer" aria-hidden="true" />
          <div className="kinetic-layer" aria-hidden="true" />
          <button
            type="button"
            className="kinetic-toggle"
            onClick={close}
            aria-label="Close"
          >
            <span className="kinetic-toggle-label" aria-hidden="true">
              <span className="kinetic-toggle-labels">
                <span>Menu</span>
                <span>Close</span>
              </span>
            </span>
            <MenuIcon close />
          </button>
          <nav className="kinetic-links" aria-label="Primary">
            <ul>
              {links.map(({ label, href, number }) => (
                <li key={href}>
                  <a href={href} onClick={followNavLink}>
                    <span className="kinetic-link-text">
                      {number && (
                        <span
                          className="kinetic-link-number"
                          aria-hidden="true"
                        >
                          {number}
                        </span>
                      )}
                      {label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {contactLinks.length > 0 && (
            <section
              className="kinetic-contact"
              aria-labelledby={`${id}-contact`}
            >
              <h2 id={`${id}-contact`}>Get in touch</h2>
              <ul>
                {contactLinks.map(({ label, href, icon }) => (
                  <li key={href}>
                    <a href={href} onClick={close} aria-label={label}>
                      {icon ? (
                        <span
                          className="kinetic-contact-icon"
                          aria-hidden="true"
                        >
                          <span className="kinetic-contact-icon-track">
                            {icon}
                            {icon}
                          </span>
                        </span>
                      ) : (
                        label
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </dialog>
    </div>
  );
}
