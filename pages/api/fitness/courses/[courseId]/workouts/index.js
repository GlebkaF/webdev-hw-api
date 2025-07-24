import { verifyToken, getCourseWorkouts } from "@/libs/fitness";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Отсутствует Authorization токен" });

  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ message: "Невалидный токен" });

  const courseId = req.query.courseId;

  try {
    const workouts = await getCourseWorkouts(courseId);
    res.status(200).json(workouts);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
