import dbConnect from "@/libs/fitness/dbConnect";
import { verifyToken } from "@/libs/fitness/auth";
import User from "@/libs/fitness/models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });
  await dbConnect();
  try {
    const { userId } = verifyToken(req);
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ message: "Не передан ID курса" });
    await User.findByIdAndUpdate(userId, { $addToSet: { courses: courseId } });
    res.status(200).json({ message: "Курс успешно добавлен" });
  } catch (error) {
    if (error.message === "Invalid Token")
      return res.status(401).json({ message: "Нет авторизации" });
    res.status(500).json({ message: "Ошибка сервера" });
  }
}
