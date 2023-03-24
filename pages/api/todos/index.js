// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getUserFromRequest } from "../user/helpers";

let lastId = 1;

export let todos = [
  {
    id: generateId(),
    text: "Сделать чаю",
    user: null,
  },
  {
    id: generateId(),
    text: "Выпить чаю",
    user: null,
  },
  {
    id: generateId(),
    text: "Отдохнуть",
    user: null,
  },
];

export default function handler(req, res) {
  const user = getUserFromRequest(req);

  try {
    if (req.method === "POST") {
      const newText = JSON.parse(req.body).text;

      if (newText === "ничего") {
        return res
          .status(400)
          .json({ error: "ничего делать нельзя, сделай что нибудь другое" });
      }

      try {
        const todo = {
          text: newText,
          id: generateId(),
          user,
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

export function setTodos(newTodos) {
  todos = newTodos;
}

export function getTodos() {
  return todos.slice(-10);
}

export function generateId() {
  return lastId++;
}
