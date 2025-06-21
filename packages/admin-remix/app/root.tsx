import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { getUserId } from "~/utils/session.server";

// Import both Tailwind and custom styles
import tailwindStyles from "./tailwind.css";
import adminStyles from "./styles/admin.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStyles },
  { rel: "stylesheet", href: adminStyles },
];

export const meta: MetaFunction = () => [
  { charset: "utf-8" },
  { title: "co2software Payroll" },
  { viewport: "width=device-width,initial-scale=1" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  return json({
    userId: await getUserId(request),
  });
}

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
