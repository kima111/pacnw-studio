import { NextResponse } from "next/server";

export function GET(request: Request) {
  const url = new URL(request.url);
  url.pathname = "/pacnw-mark.svg";
  url.search = "";
  return NextResponse.redirect(url, 308);
}


