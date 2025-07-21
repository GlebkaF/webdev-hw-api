// middleware.ts
import { NextResponse } from "next/server";

// Эта функция может быть асинхронной, если вы используете await
export default function middleware(request) {
  // Эта логика теперь будет применяться только к путям, указанным в matcher

  if (request.method === "OPTIONS") {
    return new NextResponse(JSON.stringify({}), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  // fyi: браузер и curl сами подставляют content-type:text/plain
  if (request.headers.get("content-type") === "application/json") {
    return new NextResponse(
      JSON.stringify({
        error:
          "В заголовке передан content-type: application/json, но эта API не умеет работать с этим заголовком, уберите его",
      }),
      {
        status: 400,
        headers: { "content-type": "application/json" },
      }
    );
  }

  // Ошибки студентов с заголовком
  if (request.headers.has("athorization")) {
    return new NextResponse(
      JSON.stringify({
        error: "В заголовке указан athorization, возможно вы имели в виду authorization?",
      }),
      {
        status: 400,
        headers: { "content-type": "application/json" },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  /*
   * Сопоставляем все пути API, КРОМЕ тех, что начинаются с /api/fitness.
   
   */
  matcher: "/api/((?!fitness).*)",
};
