import { NotFoundGlitch } from "@/components/ui/be-ui-404-not-found";

const NotFound = () => (
  <main className="dark selection:bg-white selection:text-black">
    <NotFoundGlitch
      className="min-h-dvh py-10 sm:py-14"
      title="Page not found."
      description="This address doesn’t lead anywhere. Head back to the portfolio to keep exploring."
      homeLabel="Back to portfolio"
    />
  </main>
);

export default NotFound;
