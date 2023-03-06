import { getTodos } from ".";

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    // Process a POST request
    const todos = getTodos();

    const todo = todos.find((todo) => todo.id === parseInt(id));

    if (todo) {
      return res.status(200).json({ todo });
    } else {
      return res.status(404).json({ error: "Задача с таким айди не найдена" });
    }
  } else if (req.method === "POST") {
    // Handle any other HTTP method
    return;
  }

  return res.status(404);
}
