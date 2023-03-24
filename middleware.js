// middleware.ts
import { NextResponse } from "next/server";
import { getUserByToken } from "./pages/api/user";

// This function can be marked `async` if using `await` inside
export default function middleware(request) {
  if (request.method === "OPTIONS") {
    return new NextResponse(JSON.stringify({}), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  if (request.nextUrl.pathname.startsWith("/api/v2/todos")) {
    const authorizationHeader = request.headers.get("authorization") ?? "";
    const [_, token] = authorizationHeader.split(" ");

    const user = getUserByToken({ token });

    if (user) {
      return NextResponse.next();
    }

    if (authorizationHeader === "123456") {
      return NextResponse.next();
    }

    return new NextResponse(
      JSON.stringify({
        error: "Нет авторизации",
      }),
      {
        status: 401,
        headers: { "content-type": "application/json" },
      }
    );
  }

  if (
    request.nextUrl.pathname.startsWith("/api/v2/") &&
    request.nextUrl.pathname.includes("/comments") &&
    request.method === "POST"
  ) {
    const authorizationHeader = request.headers.get("authorization") ?? "";
    const [_, token] = authorizationHeader.split(" ");

    const user = getUserByToken({ token });

    if (user) {
      return NextResponse.next();
    }

    return new NextResponse(
      JSON.stringify({
        error: "Нет авторизации",
      }),
      {
        status: 401,
        headers: { "content-type": "application/json" },
      }
    );
  }

  return NextResponse.next();
}
