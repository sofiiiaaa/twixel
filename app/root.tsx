import type { LinksFunction, MetaFunction } from "remix";
import { Links, LiveReload, Outlet, useCatch, Meta, Scripts } from "remix";

export const links: LinksFunction = () => {
  return [];
};

export const meta: MetaFunction = () => {
  const description = `Il mio primo sito in Remix fatto durante il Voxel Bootcamp! @voxelcommunity`;
  return {
    description,
    keywords: "Remix,twixes",
    "twitter:image": "https://remix-twixes.lol/social.png",
    "twitter:card": "summary_large_image",
    "twitter:creator": "@remix_run",
    "twitter:site": "@remix_run",
    "twitter:title": "Remix Twixes",
    "twitter:description": description,
  };
};


function Document({
  children,
  title = `Remix: So great, it's funny!`,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}


export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document
      title={`${caught.status} ${caught.statusText}`}
    >
      <div className="error-container">
        <h1>
          {caught.status} {caught.statusText}
        </h1>
      </div>
    </Document>
  );
}


export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return (
    <Document title="Uh-oh!">
      <div>
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </div>
    </Document>
  );
}