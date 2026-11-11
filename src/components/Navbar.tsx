import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa6";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { contactHref } from "@/components/hero/contact";
import { Component } from "@/components/ui/sterling-gate-kinetic-navigation";

const navItems = [
  { label: "About", href: "#about", number: "01" },
  { label: "Work", href: "#work", number: "02" },
  { label: "Philosophy", href: "#philosophy", number: "03" },
  { label: "Contact", href: "#contact", number: "04" },
];

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

export default function Navbar() {
  return <Component links={navItems} contactLinks={socials} />;
}
