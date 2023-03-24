// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { default as todosHandler } from "../../todos";

export default function handler(req, res) {
  return todosHandler(req, res);
}
