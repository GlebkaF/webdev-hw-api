// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { addComment, getComments } from "@/libs/comments";
import { getUserFromRequest } from "@/libs/users";

export default async function handler(req, res) {
  try {
    const key = req.query.key;

    if (key === ":personal-key") {
      return res.status(400).json({
        error:
          "Замените :personal-key в адресе на свое имя или фамилию, например gleb-fokin",
      });
    }

    const user = await getUserFromRequest(req);

    if (req.method === "GET") {
      const comments = await getComments(key);

      return res.status(200).json({
        comments: comments.map((comment) => {
          return {
            id: comment._id,
            date: comment.date,
            text: comment.text,
            author: {
              name: comment.user.name,
              login: comment.user.login,
            },
            likes: comment.likes.length,
            isLiked: !!comment.likes.find((like) => like.login === user?.login),
          };
        }),
      });
    }

    if (!user) {
      return res.status(401).json({ error: "Нет авторизации" });
    }

    if (req.method === "POST") {
      try {
        const { text } = JSON.parse(req.body);

        if (!text) {
          return res.status(400).json({ error: "В теле не передан text" });
        }

        if (text.length < 3) {
          return res
            .status(400)
            .json({ error: "text должен содержать хотя бы 3 символа" });
        }

        await addComment({
          key,
          user,
          text,
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
