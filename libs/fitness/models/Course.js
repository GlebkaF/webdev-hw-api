import mongoose, { Schema, model } from "mongoose";

const courseSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    nameEN: { type: String, required: true },
    description: { type: String, required: true },
    directions: { type: [String], default: [] },
    fitting: { type: [String], default: [] },
    order: { type: Number, required: true },
    durationDays: { type: Number, default: 30 },
    dailyTimeMinutes: { type: Number, default: 30 },
    difficulty: {
      type: String,
      enum: ["начальный", "средний", "продвинутый"],
      default: "начальный",
    },
    workouts: [{ type: Schema.Types.ObjectId, ref: "Workout" }],
  },
  { timestamps: true }
);

export default mongoose.models.Course || model("Course", courseSchema);
