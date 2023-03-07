import { getTodos, setTodos } from ".";

export default function handler(req, res) {
  const { id } = req.query;

  // Process a GET request
  const todos = getTodos();

  if (req.method === "DELETE") {
    const todoIndex = todos.findIndex((todo) => todo.id === parseInt(id));

    if (todoIndex === -1) {
      return res.status(404).json({ error: "Задача не найдена" });
    }

    todos.splice(todoIndex, 1);

    setTodos(todos);

    return res.status(200).json({ todos: getTodos() });
  }

  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }

  const todo = todos.find((todo) => todo.id === parseInt(id));

  if (todo) {
    return res.status(200).json({ todo });
  } else {
    return res.status(404).json({ error: "Задача с таким айди не найдена" });
  }
}
