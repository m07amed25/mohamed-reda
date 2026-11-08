import About from "@/components/about/About";
import { BrandLogo } from "@/components/hero/brand-logo";
import { CursorFollower } from "@/components/hero/cursor-follower";
import { Hero } from "@/components/hero/hero";

export { Mail } from "lucide-react";
export {
  FaGithub as Github,
  FaInstagram as Instagram,
  FaLinkedin as Linkedin,
} from "react-icons/fa6";

const Index = () => (
  <div className="min-h-screen relative bg-black selection:bg-white selection:text-black">
    <BrandLogo />
    <CursorFollower />
    <Hero />
    <About />
  </div>
);

export default Index;
