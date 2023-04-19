import { deletePost } from "@/libs/instapro";
import { getUserFromRequest } from "@/libs/users";

export default async function handler(req, res) {
  const { id, key } = req.query;

  const user = await getUserFromRequest(req);

  if (!user) {
    return res.status(401).json({ error: "Нет авторизации" });
  }

  if (req.method !== "DELETE") {
    return res.status(404).json({});
  }

  try {
    if (key === "prod") {
      throw new Error("Удалять посты с prod нельзя");
    }
    await deletePost({ id });

    return res.status(200).json({ result: "ok" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
