import { use } from "react";
import { getUserByToken } from ".";

export function getUserFromRequest(req) {
  const authorizationHeader = req.headers.authorization ?? "";

  const [_, token] = authorizationHeader.split(" ");
  const user = getUserByToken({ token });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    login: user.login,
    name: user.name,
  };
}
