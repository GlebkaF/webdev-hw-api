import { deleteComment, toggleLike } from "@/libs/comments";
import { getUserFromRequest } from "@/libs/users";

export default async function handler(req, res) {
  const { id } = req.query;

  const user = await getUserFromRequest(req);

  if (!user) {
    return res.status(401).json({ error: "Нет авторизации" });
  }

  if (req.method !== "DELETE") {
    return res.status(404).json({});
  }

  try {
    await deleteComment({ id });

    return res.status(200).json({ result: "ok" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
