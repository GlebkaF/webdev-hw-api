import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      match: /^.+@.+\..+$/,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    selectedCourses: [
      {
        type: String,
        ref: "fitness_courses", // можно populate()
      },
    ],
    courseProgress: [
      {
        courseId: { type: String, ref: "fitness_courses" },
        courseCompleted: { type: Boolean, default: false },
        workoutsProgress: [
          {
            workoutId: { type: String, ref: "fitness_workout" },
            workoutCompleted: { type: Boolean, default: false },
            progressData: [Number],
          },
        ],
      },
    ],
  },
  {
    timestamps: true, // createdAt и updatedAt
  }
);

export const User =
  mongoose.models.fitness_users || mongoose.model("fitness_users", userSchema);

const courseSchema = new mongoose.Schema({
  _id: String,
  description: String,
  directions: [String],
  fitting: [String],
  nameEN: String,
  nameRU: String,
  order: Number,
  difficulty: {
    type: String,
    enum: ["начальный", "средний", "сложный"],
  },
  durationInDays: Number,
  dailyDurationInMinutes: {
    from: Number,
    to: Number,
  },
  workouts: [{ type: String, ref: "fitness_workouts" }],
});

export const Course =
  mongoose.models.fitness_courses ||
  mongoose.model("fitness_courses", courseSchema);

const workoutSchema = new mongoose.Schema({
  _id: String,
  name: String,
  video: String,
  exercises: [
    {
      name: String,
      quantity: Number,
    },
  ],
});

export const Workout =
  mongoose.models.fitness_workouts ||
  mongoose.model("fitness_workouts", workoutSchema);
