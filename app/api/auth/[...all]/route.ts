// app/api/auth/[...all]/route.ts
//
// Lazy handler construction — getAuth() and toNextJsHandler() are called on
// first request, not at module import time. This prevents betterAuth()
// construction during `next build`.

import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth";
import type { NextRequest } from "next/server";

type AuthHandler = (req: NextRequest) => Promise<Response>;

let _handlers: { GET: AuthHandler; POST: AuthHandler } | null = null;

function getHandlers() {
  if (!_handlers) {
    _handlers = toNextJsHandler(getAuth()) as {
      GET: AuthHandler;
      POST: AuthHandler;
    };
  }
  return _handlers;
}

export async function GET(request: NextRequest) {
  return getHandlers().GET(request);
}

export async function POST(request: NextRequest) {
  return getHandlers().POST(request);
}
