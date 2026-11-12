import { socialLinks } from "@/components/hero/contact";
import { Component } from "@/components/ui/sterling-gate-kinetic-navigation";

const navItems = [
  { label: "About", href: "#about", number: "01" },
  { label: "Work", href: "#work", number: "02" },
  { label: "Philosophy", href: "#philosophy", number: "03" },
  { label: "Contact", href: "#contact", number: "04" },
];

const socials = socialLinks.map(({ label, href, icon: Icon }) => ({ label, href, icon: <Icon /> }));

export default function Navbar() {
  return <Component links={navItems} contactLinks={socials} />;
}
