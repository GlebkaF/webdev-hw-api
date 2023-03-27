// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getUserFromRequest } from "@/libs/users";
import { default as todosHandler } from "../../todos/[id]";

export default async function handler(req, res) {
  const user = await getUserFromRequest(req);
  const authByPassword = req.headers.authorization === "123456";

  if (user || authByPassword) {
    return todosHandler(req, res, user);
  }

  return res.status(401).json({ error: "Нет авторизации" });
}
