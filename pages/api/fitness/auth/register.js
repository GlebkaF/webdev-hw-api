import { registerUser } from "@/libs/fitness";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = JSON.parse(req.body);

  try {
    await registerUser({ email, password });
    res.status(201).json({ message: "Регистрация прошла успешно!" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
