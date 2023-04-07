import { dislikePost, findPost, mapPost } from "@/libs/instapro";
import { getUserFromRequest } from "@/libs/users";

export default async function handler(req, res) {
  const { id } = req.query;

  const user = await getUserFromRequest(req);

  if (!user) {
    return res.status(401).json({ error: "Нет авторизации" });
  }

  if (req.method !== "POST") {
    return res.status(404).json({});
  }

  try {
    await dislikePost({ id, user });

    const post = await findPost(id);

    return res.status(200).json({ post: mapPost(post, user) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
