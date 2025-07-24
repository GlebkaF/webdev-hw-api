import { verifyToken } from "@/libs/fitness";
import { markWorkoutProgress } from "@/libs/fitness";

export default async function handler(req, res) {
  if (req.method !== "PATCH") return res.status(405).end();

  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Отсутствует Authorization токен" });

  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ message: "Невалидный токен" });

  const { courseId, workoutId } = req.query;

  if (!courseId)
    return res.status(400).json({ message: "ID курса должен быть указан" });
  if (!workoutId)
    return res
      .status(400)
      .json({ message: "ID тренировки должен быть указан" });

  if (!req.body)
    return res
      .status(400)
      .json({
        message: "Тело запроса должно быть не пустым и содержать progressData",
      });
  const { progressData } = JSON.parse(req.body);

  try {
    await markWorkoutProgress(decoded.id, courseId, workoutId, progressData);
    res.status(200).json({ message: "Прогресс по данной тренировке отмечен!" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
