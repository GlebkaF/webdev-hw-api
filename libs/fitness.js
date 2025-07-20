import { connectToDatabase } from "./mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

// JWT token

export function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

// User fields validators

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  if (password.length < 6) {
    return "Пароль должен содержать не менее 6 симоволов";
  }

  const specialCharCount = (password.match(/[^A-Za-z0-9]/g) || []).length;
  if (specialCharCount < 2) {
    return "Пароль должен содержать не менее 2 спецсимволов";
  }

  if (!/[A-Z]/.test(password)) {
    return "Пароль должен содержать как минимум одну заглавную букву";
  }

  return null;
}

export async function registerUser({ email, password }) {
  const { db } = await connectToDatabase();

  if (!validateEmail(email)) {
    throw new Error("Введите корректный Email");
  }

  const existingUser = await db.collection("fitness_users").findOne({ email });
  if (existingUser) {
    throw new Error("Пользователь с таким именем уже существует");
  }

  const validatePasswordError = validatePassword(password);
  if (validatePasswordError) {
    throw new Error(validatePasswordError);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await db
    .collection("fitness_users")
    .insertOne({ email, password: hashedPassword });

  const jwt_token = signToken({ id: newUser._id });
  return jwt_token;
}

export async function loginUser({ email, password }) {
  const { db } = await connectToDatabase();

  const user = await db.collection("fitness_users").findOne({ email: email });
  if (!user) throw new Error("Пользователь с таким логином не найден");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Неверный пароль");

  const token = signToken({ id: user._id });
  return token;
}

export async function getUserByToken(token) {
  const decoded = verifyToken(token);
  if (!decoded) throw new Error("Невалидный токен");

  const { db } = await connectToDatabase();

  const user = await db.collection("fitness_users").findOne(
    { _id: new ObjectId(decoded.id) },
    { projection: { password: 0, _id: 0 } } // 0 — исключить поле password
  );

  if (!user) throw new Error("Пользователь не найден");

  return user;
}

// COURSES

export async function getAllCourses() {
  const { db } = await connectToDatabase();

  const courses = await db.collection("fitness_courses").find({}).toArray();

  return courses;
}

export async function getCourseById(courseId) {
  const { db } = await connectToDatabase();

  const course = await db
    .collection("fitness_courses")
    .findOne({ _id: courseId });

  if (!course) throw new Error("Курс с данным ID не найден");

  return course;
}

export async function addCourseToUser(userDecodedId, courseId) {
  const { db } = await connectToDatabase();

  const course = await db
    .collection("fitness_courses")
    .findOne({ _id: courseId });
  if (!course) throw new Error("Курс с данным ID не найден");

  const userId = new ObjectId(userDecodedId);
  const user = await db.collection("fitness_users").findOne({ _id: userId });
  if (!user) throw new Error("Пользователь не найден")

  const hasCourse = user.courses?.some((c) => c.equals(course._id));
  if (!hasCourse) {
    await db
      .collection("fitness_users")
      .updateOne({ _id: userId }, { $push: { selectedCourses: course._id } });
  }
}

export async function deleteCourseFromUser(userDecodedId, courseId) {
  const { db } = await connectToDatabase();

  const userId = new ObjectId(userDecodedId);
  const user = await db.collection("fitness_users").findOne({ _id: userId });
  if (!user) throw new Error("Пользователь не найден")

  await db
    .collection("fitness_users")
    .updateOne(
      { _id: userId },
      { $pull: { selectedCourses: courseId } }
    );
}

// WORKOUTS

export async function getCourseWorkouts(courseId) {
  const { db } = await connectToDatabase();

  const course = await getCourseById(courseId);
  const workoutIds = course.workouts || [];

  const workouts = await db
    .collection("fitness_workouts")
    .find({ _id: { $in: workoutIds } })
    .toArray();

  return workouts;
}

export async function getWorkoutById(workoutId) {
  const { db } = await connectToDatabase();

  const workout = await db
    .collection("fitness_workouts")
    .findOne({ _id:workoutId });

  if (!workout) throw new Error("Тренировка с данным ID не найдена");

  return workout;
}

// PROGRESS 

function validateProgressData(progressData, workout) {
  if (
    !Array.isArray(progressData) ||
    !Array.isArray(workout?.exercises)
  ) {
    return false
  }

  if (progressData.length !== workout.exercises.length) {
    return false
  }

  for (let reps of progressData) {
    if (typeof reps !== 'number' || !Number.isFinite(reps) || reps < 0) {
      return false
    }
  }

  return true
}

export async function getWorkoutProgress(userDecodedId, workoutId) {
  const { db } = await connectToDatabase();

  const userId = new ObjectId(userDecodedId);

  const workout = await db
    .collection("fitness_workouts")
    .findOne({ _id: workoutId });

  if (!workout) throw new Error("Тренировка с данным ID не найдена");

  const user = await db.collection("fitness_users").findOne(
    { _id: new ObjectId(userId) },
    { projection: { workoutProgress: 1 } }
  )

  if (!user) {
    throw new Error("Пользователь не найден");
  }

  return workoutId
    ? user.workoutProgress?.filter(p => p.workoutId === workoutId) ?? []
    : []
}

export async function markWorkoutProgress(userDecodedId, workoutId, progressData) {
  const { db } = await connectToDatabase();

  const userId = new ObjectId(userDecodedId);

  const workout = await db
    .collection("fitness_workouts")
    .findOne({ _id: workoutId });

  if (!workout) throw new Error("Тренировка с данным ID не найдена");

  if (!validateProgressData(progressData, workout)) throw new Error("Прогресс по тренировкам не валидный!")

  await db.collection("fitness_users").updateOne(
    { _id: new ObjectId(userId) },
    {
      $push: {
        workoutProgress: {
          workoutId,
          progressData
        }
      }
    }
  )
}
