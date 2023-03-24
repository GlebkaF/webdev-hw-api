import { omit } from "lodash";
import { getUserByToken } from ".";

export function getUserFromRequest(req) {
  const authorizationHeader = req.headers.authorization ?? "";
  console.log(req.headers);
  const [_, token] = authorizationHeader.split(" ");
  const user = getUserByToken({ token });

  return omit(user, ["token", "password"]) ?? null;
}
