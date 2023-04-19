// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getUserPosts } from "@/libs/instapro";
import { getUserFromRequest } from "@/libs/users";

export default async function handler(req, res) {
  const { key, user } = req.query;

  if (key === ":personal-key") {
    return res.status(400).json({
      error:
        "Замените :personal-key в адресе на свое имя или фамилию, например gleb-fokin",
    });
  }

  if (req.method === "GET") {
    const posts = await getUserPosts({ key, id: user });

    const currentUser = await getUserFromRequest(req);

    return res.status(200).json({
      posts: posts.map((comment) => {
        return {
          id: comment._id,
          imageUrl: comment.imageUrl,
          createdAt: comment.createdAt,
          description: comment.description,
          user: {
            id: comment.user._id,
            name: comment.user.name,
            login: comment.user.login,
            imageUrl: comment.user.imageUrl,
          },
          likes: comment.likes,
          isLiked: !!comment.likes.find(
            (like) => like.login === currentUser?.login
          ),
        };
      }),
    });
  }

  return res.status(405).json({ error: "Метод не реализован" });
}
