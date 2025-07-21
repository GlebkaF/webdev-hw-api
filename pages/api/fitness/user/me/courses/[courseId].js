import dbConnect from "@/libs/fitness/dbConnect";
import { verifyToken } from "@/libs/fitness/auth";
import Course from "@/libs/fitness/models/Course";
import UserProgress from "@/libs/fitness/models/UserProgress";
import User from "@/libs/fitness/models/User";
import "@/libs/fitness/models/Workout";

export default async function handler(req, res) {
  const {
    query: { courseId },
    method,
  } = req;
  await dbConnect();
  try {
    const { userId } = verifyToken(req);
    if (method === "GET") {
      const course = await Course.findById(courseId).populate("workouts").lean();
      if (!course) return res.status(404).json({ message: "Курс не найден" });
      const userProgress = await UserProgress.find({ user: userId, course: courseId });
      const completedWorkouts = new Set(userProgress.map((p) => p.workout.toString()));
      course.workouts = course.workouts.map((workout) => ({
        ...workout,
        isCompleted: completedWorkouts.has(workout._id.toString()),
      }));
      return res.status(200).json(course);
    } else if (method === "DELETE") {
      await User.findByIdAndUpdate(userId, { $pull: { courses: courseId } });
      return res.status(200).json({ message: "Курс успешно удален" });
    } else {
      res.setHeader("Allow", ["GET", "DELETE"]);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    if (error.message === "Invalid Token")
      return res.status(401).json({ message: "Нет авторизации" });
    return res.status(500).json({ message: "Ошибка сервера" });
  }
}
