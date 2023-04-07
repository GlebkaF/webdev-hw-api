import { toggleLike } from "@/libs/comments";
import { getUserFromRequest } from "@/libs/users";

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    const user = await getUserFromRequest(req);

    if (!user) {
      return res.status(401).json({ error: "Нет авторизации" });
    }

    if (req.method !== "POST") {
      return res.status(404).json({});
    }

    const result = await toggleLike({ id, user });

    return res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
