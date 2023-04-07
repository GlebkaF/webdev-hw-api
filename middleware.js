// middleware.ts
import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export default function middleware(request) {
  if (request.method === "OPTIONS") {
    return new NextResponse(JSON.stringify({}), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  // Ошибки студентов с заголовком
  if (request.headers.has("athorization")) {
    return new NextResponse(
      JSON.stringify({
        error:
          "В заголовке указан athorization, возможно вы имели в виду authorization?",
      }),
      {
        status: 400,
        headers: { "content-type": "application/json" },
      }
    );
  }

  return NextResponse.next();
}
