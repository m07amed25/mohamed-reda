import About from "@/components/about/About";
import { BrandLogo } from "@/components/hero/brand-logo";
import { CursorFollower } from "@/components/hero/cursor-follower";
import { Hero } from "@/components/hero/hero";
import Navbar from "@/components/Navbar";
import SelectedWork from "@/components/SelectedWork";

export { Mail } from "lucide-react";
export {
  FaGithub as Github,
  FaInstagram as Instagram,
  FaLinkedin as Linkedin,
} from "react-icons/fa6";

const Index = () => (
  <div className="min-h-screen relative bg-black selection:bg-white selection:text-black">
    <Navbar />
    <BrandLogo />
    <CursorFollower />
    <Hero />
    <div id="about" />
    <About />

    <SelectedWork />
  </div>
);

export default Index;
