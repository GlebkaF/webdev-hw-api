import "dotenv/config";
import mongoose from "mongoose";
import rawData from "../data.json" with { type: "json" }; 

import User from "../libs/fitness/models/User.js";
import Course from "../libs/fitness/models/Course.js";
import Workout from "../libs/fitness/models/Workout.js";
import UserProgress from "../libs/fitness/models/UserProgress.js";

const MONGODB_URI = process.env.MONGODB_URI;

const seedDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Mongoose Connected for Seeding...");

    // Очистка коллекций
    await Course.deleteMany({});
    await Workout.deleteMany({});
    await UserProgress.deleteMany({});
    await User.deleteMany({});
    console.log("Existing fitness data cleared.");

    // 1. Вставляем тренировки
    const preparedWorkouts = Object.values(rawData.workouts).map((w) => ({
      name: w.name,
      video: w.video,
      exercises: w.exercises || [], // Добавляем || [] на случай, если у тренировки нет упражнений
    }));
    const insertedWorkouts = await Workout.insertMany(preparedWorkouts);
    console.log(`Inserted ${insertedWorkouts.length} workouts.`);

    // Создаем карту старых ID на новые ObjectId
    const workoutIdMap = {};
    insertedWorkouts.forEach((newWorkout, index) => {
      const oldId = Object.values(rawData.workouts)[index]._id;
      workoutIdMap[oldId] = newWorkout._id;
    });

    // 2. Вставляем курсы с обновленными ссылками
    const preparedCourses = Object.values(rawData.courses).map((c) => ({
      name: c.nameRU,
      nameEN: c.nameEN,
      description: c.description,
      directions: c.directions,
      fitting: c.fitting,
      order: c.order,
      workouts: c.workouts.map((oldWorkoutId) => workoutIdMap[oldWorkoutId]).filter(Boolean),
    }));

    await Course.insertMany(preparedCourses);
    console.log(`Inserted ${preparedCourses.length} courses.`);

    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await mongoose.connection.close();
    console.log("Mongoose connection closed.");
  }
};

seedDB();
