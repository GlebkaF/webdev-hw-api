import dbConnect from "@/libs/fitness/dbConnect";
import Workout from "@/libs/fitness/models/Workout";
import { verifyToken } from "@/libs/fitness/auth";

export default async function handler(req, res) {
  const {
    query: { workoutId },
    method,
  } = req;
  if (method !== "GET") return res.status(405).json({ message: `Method ${method} Not Allowed` });
  await dbConnect();
  try {
    verifyToken(req);
    const workout = await Workout.findById(workoutId);
    if (!workout) return res.status(404).json({ message: "Тренировка не найдена" });
    res.status(200).json(workout);
  } catch (error) {
    if (error.message === "Invalid Token")
      return res.status(401).json({ message: "Нет авторизации" });
    res.status(500).json({ message: "Ошибка сервера" });
  }
}
