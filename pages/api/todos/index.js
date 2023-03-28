// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

let lastId = 1;

export let todos = [
  {
    id: generateId(),
    text: "Сделать чаю",
    created_at: new Date("2023-01-02T08:19:00.916Z"),
    user: null,
  },
  {
    id: generateId(),
    text: "Выпить чаю",
    created_at: new Date("2023-01-03T08:19:00.916Z"),
    user: null,
  },
  {
    id: generateId(),
    text: "Отдохнуть",
    created_at: new Date("2023-01-04T08:19:00.916Z"),
    user: null,
  },
];

export default function handler(req, res, user = null) {
  try {
    if (req.method === "POST") {
      const newText = JSON.parse(req.body).text;

      if (newText.toLowerCase() === "ничего") {
        return res
          .status(400)
          .json({ error: "ничего делать нельзя, сделай что нибудь другое" });
      }

      try {
        const todo = {
          text: newText,
          id: generateId(),
          created_at: new Date(),
          user: user
            ? {
                name: user.name,
              }
            : null,
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
