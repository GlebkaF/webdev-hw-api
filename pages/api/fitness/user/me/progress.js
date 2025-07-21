import dbConnect from "@/libs/fitness/dbConnect";
import { verifyToken } from "@/libs/fitness/auth";
import UserProgress from "@/libs/fitness/models/UserProgress";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method Not Allowed" });
  await dbConnect();
  try {
    const { userId } = verifyToken(req);
    const userProgress = await UserProgress.find({ user: userId });
    res.status(200).json(userProgress);
  } catch (error) {
    if (error.message === "Invalid Token")
      return res.status(401).json({ message: "Нет авторизации" });
    res.status(500).json({ message: "Ошибка сервера" });
  }
}
