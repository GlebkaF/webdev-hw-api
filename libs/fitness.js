import { connectToMongoose } from "./mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, Course, Workout } from "../model/fitness/schema";

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

async function getUserById(userId) {
  const user = await User.findOne(
    { _id: userId },
    { projection: { password: 0, _id: 0 } } // 0 — исключить поле password
  );

  if (!user) throw new Error("Пользователь не найден");

  return user;
}

export async function registerUser({ email, password }) {
  await connectToMongoose();

  if (!validateEmail(email)) {
    throw new Error("Введите корректный Email");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Пользователь с таким email уже существует");
  }

  const validatePasswordError = validatePassword(password);
  if (validatePasswordError) {
    throw new Error(validatePasswordError);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.insertOne({ email, password: hashedPassword });
}

export async function loginUser({ email, password }) {
  await connectToMongoose();

  const user = await User.findOne({ email });
  if (!user) throw new Error("Пользователь с таким email не найден");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Неверный пароль");

  const token = signToken({ id: user._id });
  return token;
}

export async function getUserByToken(token) {
  const decoded = verifyToken(token);
  if (!decoded) throw new Error("Невалидный токен");

  await connectToMongoose();

  const user = await getUserById(decoded.id);

  return user;
}

// COURSES

async function extractCourseById(courseId) {
  const course = await Course.findOne({ _id: courseId });
  if (!course) throw new Error("Курс с данным ID не найден");

  return course;
}

export async function getAllCourses() {
  await connectToMongoose();

  const courses = await Course.find({});

  return courses;
}

export async function getCourseById(courseId) {
  await connectToMongoose();

  const course = await extractCourseById(courseId);

  return course;
}

export async function addCourseToUser(userId, courseId) {
  await connectToMongoose();

  const course = await extractCourseById(courseId);

  const user = await getUserById(userId);

  const hasCourse = user.selectedCourses?.some((c) => c == courseId);
  if (!hasCourse) {
    await User.updateOne(
      { _id: userId },
      { $push: { selectedCourses: course._id } }
    );
  } else {
    throw new Error("Курс уже был добавлен!");
  }
}

export async function deleteCourseFromUser(userId, courseId) {
  await connectToMongoose();

  await validateUserSelectedThisCourse(userId, courseId);

  await User.updateOne(
    { _id: userId },
    {
      $pull: {
        selectedCourses: courseId,
        courseProgress: {
          courseId,
        },
      },
    }
  );
}

// WORKOUTS

async function extractWorkoutById(workoutId) {
  const workout = await Workout.findOne({ _id: workoutId });
  if (!workout) throw new Error("Тренировка с данным ID не найдена");

  return workout;
}

export async function getCourseWorkouts(courseId) {
  await connectToMongoose();

  const course = await getCourseById(courseId);
  const workoutIds = course.workouts || [];

  const workouts = await Workout.find({ _id: { $in: workoutIds } });

  return workouts;
}

export async function getWorkoutById(workoutId) {
  await connectToMongoose();

  const workout = await extractWorkoutById(workoutId);

  return workout;
}

// PROGRESS

async function validateUserSelectedThisCourse(userId, courseId) {
  const user = await getUserById(userId);

  const hasCourse = user.selectedCourses?.some((c) => c == courseId);
  if (!hasCourse) throw new Error("У пользователя не был добавлен этот курс!");
}

async function validateCourseAndWorkoutIDs(courseId, workoutId) {
  const course = await extractCourseById(courseId);

  const workout = await extractWorkoutById(workoutId);

  if (!course.workouts.find((w) => w === workoutId)) {
    throw new Error("В данном курсе нет такой тренировки.");
  }
}

function validateProgressData(progressData, workout) {
  if (!Array.isArray(progressData) || !Array.isArray(workout?.exercises)) {
    return false;
  }

  if (progressData.length !== workout.exercises.length) {
    return false;
  }

  for (let reps of progressData) {
    if (typeof reps !== "number" || !Number.isFinite(reps) || reps < 0) {
      return false;
    }
  }

  return true;
}

export async function getWorkoutProgress(userId, courseId, workoutId) {
  await connectToMongoose();

  const user = await getUserById(userId);

  await validateUserSelectedThisCourse(userId, courseId);
  await validateCourseAndWorkoutIDs(courseId, workoutId);

  const courseProgress = user.courseProgress.find(
    (c) => c.courseId === courseId
  );

  if (!courseProgress) {
    return { workoutId };
  }

  const workoutProgress = courseProgress.workoutsProgress.find(
    (w) => w.workoutId === workoutId
  );

  return workoutProgress ?? { workoutId };
}

export async function getAllWorkoutsProgress(userId, courseId) {
  await connectToMongoose();

  const user = await getUserById(userId);

  await validateUserSelectedThisCourse(userId, courseId);

  const courseProgress = user.courseProgress.find(
    (cp) => cp.courseId === courseId
  );

  return courseProgress ?? { courseId };
}

export async function markWorkoutProgress(
  userId,
  courseId,
  workoutId,
  progressData
) {
  await connectToMongoose();

  await validateUserSelectedThisCourse(userId, courseId);
  await validateCourseAndWorkoutIDs(courseId, workoutId, progressData);

  const workout = await extractWorkoutById(workoutId);

  if (!validateProgressData(progressData, workout))
    throw new Error("Прогресс по тренировкам не валидный!");

  // Если у тренировки нет упражнений.
  if (workout.exercises.length === 0) {
    saveWorkoutProgress(userId, courseId, workoutId, true);
    return;
  }

  const requiredProgress = workout.exercises.map((v) => v.quantity);
  const isWorkoutCompleted = progressData.every(
    (val, i) => val >= requiredProgress[i]
  );

  saveWorkoutProgress(
    userId,
    courseId,
    workoutId,
    isWorkoutCompleted,
    progressData
  );
}

export async function restartCourseForUser(userId, courseId) {
  await connectToMongoose();

  await validateUserSelectedThisCourse(userId, courseId);

  await User.updateOne(
    { _id: userId },
    {
      $pull: {
        courseProgress: {
          courseId,
        },
      },
    }
  );
}

export async function restartWorkoutForUser(userId, courseId, workoutId) {
  await connectToMongoose();

  const user = await getUserById(userId);

  await validateUserSelectedThisCourse(userId, courseId);
  await validateCourseAndWorkoutIDs(courseId, workoutId);

  await User.updateOne(
    {
      _id: userId,
      "courseProgress.courseId": courseId,
    },
    {
      $pull: {
        "courseProgress.$.workoutsProgress": { workoutId: workoutId },
      },
    }
  );

  await markCourseCompletion(userId, courseId);
}

async function markCourseCompletion(userId, courseId) {
  await connectToMongoose();

  const user = await getUserById(userId);

  const course = await extractCourseById(courseId);
  const totalWorkouts = course.workouts.length;

  const courseProgress = user.courseProgress.find(
    (cp) => cp.courseId === courseId
  );

  const completedWorkoutCount = courseProgress
    ? courseProgress.workoutsProgress.filter((wp) => wp.workoutCompleted).length
    : 0;

  await User.updateOne(
    {
      _id: user._id,
      "courseProgress.courseId": courseId,
    },
    {
      $set: {
        "courseProgress.$.courseCompleted":
          completedWorkoutCount >= totalWorkouts,
      },
    }
  );
}

async function saveWorkoutProgress(
  userId,
  courseId,
  workoutId,
  workoutCompleted,
  progressData
) {
  const user = await getUserById(userId);

  const course = user.courseProgress.find((cp) => cp.courseId === courseId);

  if (!course) {
    // Курс ещё не добавлен
    await User.updateOne(
      { _id: userId },
      {
        $push: {
          courseProgress: {
            courseId,
            workoutsProgress: [
              {
                workoutId,
                workoutCompleted,
                progressData,
              },
            ],
          },
        },
      }
    );
  } else {
    // Курс уже есть

    const workout = course.workoutsProgress.find(
      (w) => w.workoutId === workoutId
    );

    if (workout) {
      // Тренировка уже есть
      await User.updateOne(
        {
          _id: userId,
          "courseProgress.courseId": courseId,
        },
        {
          $set: {
            "courseProgress.$[course].workoutsProgress.$[workout].progressData":
              progressData,
            "courseProgress.$[course].workoutsProgress.$[workout].workoutCompleted":
              workoutCompleted,
          },
        },
        {
          arrayFilters: [
            { "course.courseId": courseId },
            { "workout.workoutId": workoutId },
          ],
        }
      );
    } else {
      await User.updateOne(
        { _id: userId, "courseProgress.courseId": courseId },
        {
          $push: {
            "courseProgress.$.workoutsProgress": {
              workoutId,
              workoutCompleted,
              progressData,
            },
          },
        }
      );
    }
  }

  await markCourseCompletion(userId, courseId);
}
