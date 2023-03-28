// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getUserFromRequest } from "@/libs/users";

let lastId = 1;

function createComment(text, user, date = new Date()) {
  return {
    id: generateId(),
    date,
    likes: 0,
    isLiked: false,
    text,
    author: user,
  };
}

const comments = {};

export default async function handler(req, res) {
  const key = req.query.key;

  if (key === ":personal-key") {
    return res.status(400).json({
      error:
        "Замените :personal-key в адресе на свое имя или фамилию, например gleb-fokin",
    });
  }

  if (req.method === "GET") {
    return res.status(200).json({ comments: getComments(key) });
  }

  const user = await getUserFromRequest(req);

  if (!user) {
    return res.status(401).json({ error: "Нет авторизации" });
  }

  try {
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

        addComment(key, createComment(text, user));

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

export function addComment(key, comment) {
  comments[key] = [...getComments(key), comment];
}

export function getComments(key) {
  if (!comments[key]) {
    comments[key] = [
      createComment(
        "Это мой первый комментарий",
        { id: 1, login: "admin", name: "Админ Глеб" },
        new Date("2023-01-01T08:19:00.916Z")
      ),
    ];
  }

  return comments[key] ?? [];
}

export function generateId() {
  return lastId++;
}
