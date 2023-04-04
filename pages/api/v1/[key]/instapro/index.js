// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { addPost, getPosts } from "@/libs/instapro";
import { getUserFromRequest } from "@/libs/users";

export default async function handler(req, res) {
  const key = req.query.key;

  if (key === ":personal-key") {
    return res.status(400).json({
      error:
        "Замените :personal-key в адресе на свое имя или фамилию, например gleb-fokin",
    });
  }

  console.log({ key });

  const user = await getUserFromRequest(req);

  if (req.method === "GET") {
    const posts = await getPosts({ key });

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
          likes: comment.likes.map((like) => ({
            id: like._id,
            name: like.name,
          })),
          isLiked: !!comment.likes.find((like) => like.login === user?.login),
        };
      }),
    });
  }

  if (!user) {
    return res.status(401).json({ error: "Нет авторизации" });
  }

  try {
    if (req.method === "POST") {
      try {
        const { description, imageUrl } = JSON.parse(req.body);

        if (!description) {
          return res
            .status(400)
            .json({ error: "В теле не передан description" });
        }

        if (!imageUrl) {
          return res.status(400).json({ error: "В теле не передан imageUrl" });
        }

        if (description.length < 1) {
          return res.status(400).json({
            error: "description должен содержать хотя бы один символ",
          });
        }

        if (!imageUrl.includes("http")) {
          return res.status(400).json({
            error:
              "imageUrl должен содержать корректную ссылку на изображение, то есть включать http",
          });
        }

        await addPost({
          user,
          description,
          imageUrl,
          key,
        });

        return res.status(201).json({ result: "ok" });
      } catch (error) {
        console.error(error);

        return res
          .status(400)
          .json({ error: "В теле запроса невалидный JSON" });
      }
    }
    res.status(404).json({});
    return;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
