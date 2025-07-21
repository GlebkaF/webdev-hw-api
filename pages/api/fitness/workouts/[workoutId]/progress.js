import Joi from "joi";
import dbConnect from "@/libs/fitness/dbConnect";
import UserProgress from "@/libs/fitness/models/UserProgress";
import { verifyToken } from "@/libs/fitness/auth";

const progressSchema = Joi.object({
  courseId: Joi.string().hex().length(24).required(),
  progress: Joi.array()
    .items(
      Joi.object({
        exerciseId: Joi.string().hex().length(24).required(),
        completedRepetitions: Joi.number().integer().min(0).required(),
      })
    )
    .required(),
});

export default async function handler(req, res) {
  const {
    query: { workoutId },
    method,
  } = req;
  if (method !== "POST") return res.status(405).json({ message: `Method ${method} Not Allowed` });
  await dbConnect();
  try {
    const { userId } = verifyToken(req);
    const { error, value } = progressSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const { courseId, progress } = value;
    const newProgress = await UserProgress.findOneAndUpdate(
      { user: userId, workout: workoutId },
      { user: userId, workout: workoutId, course: courseId, progress },
      { new: true, upsert: true }
    );
    res.status(201).json(newProgress);
  } catch (error) {
    if (error.message === "Invalid Token")
      return res.status(401).json({ message: "Нет авторизации" });
    res.status(500).json({ message: "Ошибка сервера" });
  }
}
