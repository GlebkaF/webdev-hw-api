import { verifyToken, restartCourseForUser } from "@/libs/fitness";

export default async function handler(req, res) {
  if (req.method !== "PATCH") return res.status(405).end();

  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Отсутствует Authorization токен" });

  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ message: "Невалидный токен" });

  const courseId = req.query.courseId;
  if (!courseId)
    return res.status(400).json({ message: "ID курса должен быть указан" });

  try {
    await restartCourseForUser(decoded.id, courseId);
    res.status(200).json({ message: "Прогресс курса удалён!" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
