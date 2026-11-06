import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Click } from "@animate-ui/react/primitives/effects/click";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReactLenis } from "lenis/react";
import Index from "@/pages/Index";
// import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ReactLenis
      root
      options={{
        autoRaf: true,
        smoothWheel: true,
        duration: 1.2,
        wheelMultiplier: 0.9,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        syncTouch: true,
        syncTouchLerp: 0.15,
        touchMultiplier: 1.2,
        touchInertiaExponent: 1.55,
      }}
    >
      <TooltipProvider>
        <Click variant="crosshair" color="#fff" size={48} />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ReactLenis>
  </QueryClientProvider>
);

export default App;
