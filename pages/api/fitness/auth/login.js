import dbConnect from "@/libs/fitness/dbConnect";
import User from "@/libs/fitness/models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });
  await dbConnect();
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Неверные учетные данные" });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Неверные учетные данные" });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "24h" });
    res.status(200).json({ token, _id: user.id, name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
}
