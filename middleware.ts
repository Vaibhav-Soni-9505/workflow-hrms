import { NextResponse } from "next/server";

// No auth guard needed for mock data app — allow all routes
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|public|api).*)"],
};
