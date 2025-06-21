import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getUserId } from "~/utils/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  
  if (userId) {
    // User is logged in, redirect to admin dashboard
    return redirect("/admin");
  } else {
    // User not logged in, redirect to login
    return redirect("/login");
  }
}

// This component should never render due to the loader redirect
export default function Index() {
  return null;
}
