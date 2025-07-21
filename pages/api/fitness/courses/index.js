import dbConnect from "@/libs/fitness/dbConnect";
import Course from "@/libs/fitness/models/Course";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method Not Allowed" });
  await dbConnect();
  try {
    const courses = await Course.find().sort({ order: 1 });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
}
