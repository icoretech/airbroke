// app/api/hc/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { NextRequest } from "next/server";

// GET /api/hc
// Health Check API Endpoint
export async function GET(request: NextRequest) {
  // Perform a check to ensure the database is working

  // Extract the value of the 'source' query parameter from the URL
  const source = request.nextUrl.searchParams.get("source");

  // Retrieve a project from the database using Prisma
  await db.project.findFirst();

  // Create a response containing information about the request method, URL pathname, and 'source' query parameter
  return new NextResponse(
    `${request.method} ${request.nextUrl.pathname} ${source}`,
  );
}
