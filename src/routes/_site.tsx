import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/_site")({
  component: SiteLayout,
});

function SiteLayout() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
