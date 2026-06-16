import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("source");
  await db.project.findFirst();

  return new NextResponse(
    `${request.method} ${request.nextUrl.pathname} ${source}`,
  );
}
