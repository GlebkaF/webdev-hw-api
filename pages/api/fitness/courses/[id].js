import dbConnect from "@/libs/fitness/dbConnect";
import Course from "@/libs/fitness/models/Course";
import "@/libs/fitness/models/Workout"; // Важно для populate

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;
  if (method !== "GET") return res.status(405).json({ message: `Method ${method} Not Allowed` });
  await dbConnect();
  try {
    const course = await Course.findById(id).populate("workouts");
    if (!course) return res.status(404).json({ message: "Курс не найден" });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
}
