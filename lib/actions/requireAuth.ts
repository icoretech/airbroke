import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";

export async function requireAuth() {
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
