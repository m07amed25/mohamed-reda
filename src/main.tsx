import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import BoxLoader from "@/components/ui/box-loader";
import "./index.css";

// The entry point mounts the app, and App.tsx owns its Fast Refresh boundary.
// eslint-disable-next-line react-refresh/only-export-components
const App = lazy(() => import("./App.tsx"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense
      fallback={<BoxLoader className="fixed inset-0 grid place-items-center bg-black" />}
    >
      <App />
    </Suspense>
  </StrictMode>,
);
