import { loginUser } from "@/libs/users";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      try {
        const { login, password } = JSON.parse(req.body);

        const user = await loginUser({ login, password });
        if (user) {
          return res.status(201).json({ user });
        } else {
          return res.status(400).json({ error: "Неверный логин или пароль" });
        }
      } catch (error) {
        console.error(error);

        return res
          .status(400)
          .json({ error: "В теле запроса невалидный JSON" });
      }
    }
    return res.status(404);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
