// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { generateId, getTodos, todos } from ".";

export default function handler(req, res) {
  if (Math.random() > 0.5) {
    return res
      .status(500)
      .json({ error: "Извините сервер упал, попробуйте позже" });
  }

  try {
    if (req.method === "POST") {
      try {
        const newText = JSON.parse(req.body).text;

        if (newText === "ничего") {
          return res
            .status(400)
            .json({ error: "ничего делать нельзя, сделай что нибудь другое" });
        }

        const todo = {
          text: newText,
          id: generateId(),
        };

        todos.push(todo);

        return res.status(201).json({ todos: getTodos() });
      } catch (error) {
        console.error(error);

        return res
          .status(400)
          .json({ error: "В теле запроса невалидный JSON" });
      }
    }
    res.status(200).json({ todos: getTodos() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
