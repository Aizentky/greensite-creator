import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Header, Footer } from "@/components/sevware/Header";
import { Starfield } from "@/components/sevware/Starfield";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Sevware — The Ultimate PvP Client" },
      { name: "description", content: "Sevware Client: dominate PvP with crystal, combat, render and donut modules. Free download for Minecraft 1.21." },
      { name: "author", content: "Sevware" },
      { property: "og:title", content: "Sevware — The Ultimate PvP Client" },
      { property: "og:description", content: "Sevware Client: dominate PvP with crystal, combat, render and donut modules. Free download for Minecraft 1.21." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Sevware — The Ultimate PvP Client" },
      { name: "twitter:description", content: "Sevware Client: dominate PvP with crystal, combat, render and donut modules. Free download for Minecraft 1.21." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a5f4b2a7-63b7-41dc-97a5-668ab6bdfe6f/id-preview-5b3e4bb7--31225575-e1f9-41dd-a681-1116120d6a4a.lovable.app-1778039922506.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a5f4b2a7-63b7-41dc-97a5-668ab6bdfe6f/id-preview-5b3e4bb7--31225575-e1f9-41dd-a681-1116120d6a4a.lovable.app-1778039922506.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Starfield />
      <Header />
      <main className="relative z-10 pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
