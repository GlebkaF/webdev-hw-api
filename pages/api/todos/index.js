// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

let lastId = 1;

let todos = [
  {
    id: generateId(),
    text: "Сделать чаю",
  },
  {
    id: generateId(),
    text: "Выпить чаю",
  },
  {
    id: generateId(),
    text: "Отдохнуть",
  },
];

export default function handler(req, res) {
  res.status(200).json({ todos: todos.slice(-10) });
}

export function setTodos(newTodos) {
  todos = newTodos;
}

export function getTodos() {
  return todos;
}

export function generateId() {
  return lastId++;
}
