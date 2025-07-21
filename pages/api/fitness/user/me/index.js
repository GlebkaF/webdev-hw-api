import dbConnect from "@/libs/fitness/dbConnect";
import { verifyToken } from "@/libs/fitness/auth";
import User from "@/libs/fitness/models/User";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  await dbConnect();

  try {
    const { userId } = verifyToken(req);

    const aggregationPipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      // "Разворачиваем" массив userInfo, чтобы получить объект
      { $unwind: "$userInfo" },

      // "Разворачиваем" массив курсов пользователя
      { $unwind: { path: "$courses", preserveNullAndEmptyArrays: true } },

      // Присоединяем полную информацию о каждом курсе
      {
        $lookup: {
          from: "courses",
          localField: "courses",
          foreignField: "_id",
          as: "courseDetails",
        },
      },
      { $unwind: { path: "$courseDetails", preserveNullAndEmptyArrays: true } },

      // Присоединяем информацию о прогрессе пользователя для каждого курса
      {
        $lookup: {
          from: "userprogresses",
          let: { course_id: "$courseDetails._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user", new mongoose.Types.ObjectId(userId)] },
                    { $eq: ["$course", "$$course_id"] },
                  ],
                },
              },
            },
          ],
          as: "userProgress",
        },
      },

      // Группируем все курсы обратно, вычисляя статистику
      {
        $group: {
          _id: "$_id",
          userInfo: { $first: "$userInfo" }, // Сохраняем информацию о пользователе
          courses: {
            // Собираем курсы в массив, только если они существуют
            $push: {
              $cond: [
                "$courseDetails._id", // Условие: если курс есть
                {
                  _id: "$courseDetails._id",
                  name: "$courseDetails.name",
                  nameEN: "$courseDetails.nameEN",
                  description: "$courseDetails.description",
                  difficulty: "$courseDetails.difficulty",
                  order: "$courseDetails.order",
                  totalWorkouts: { $size: "$courseDetails.workouts" },
                  completedWorkouts: { $size: "$userProgress" },
                  progressPercentage: {
                    $cond: [
                      { $eq: [{ $size: "$courseDetails.workouts" }, 0] },
                      0,
                      {
                        $round: [
                          {
                            $multiply: [
                              {
                                $divide: [
                                  { $size: "$userProgress" },
                                  { $size: "$courseDetails.workouts" },
                                ],
                              },
                              100,
                            ],
                          },
                        ],
                      },
                    ],
                  },
                },
                "$$REMOVE", // Если курса нет, не добавляем его в массив
              ],
            },
          },
        },
      },

      // Финальное формирование ответа
      {
        $project: {
          _id: "$userInfo._id",
          email: "$userInfo.email",
          name: "$userInfo.name",
          courses: "$courses",
        },
      },
    ];

    const result = await User.aggregate(aggregationPipeline);

    // Если у пользователя нет курсов или он вообще не найден,
    // агрегация может вернуть пустой массив.
    if (!result.length) {
      const user = await User.findById(userId).select("-password");
      if (!user) return res.status(404).json({ message: "Пользователь не найден" });
      const userResponse = user.toObject();
      userResponse.courses = []; // Гарантируем, что поле courses существует
      return res.status(200).json(userResponse);
    }

    res.status(200).json(result[0]);
  } catch (error) {
    if (error.message === "Invalid Token") {
      return res.status(401).json({ message: "Нет авторизации" });
    }
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}
