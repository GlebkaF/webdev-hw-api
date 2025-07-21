import mongoose, { Schema, model } from "mongoose";

const userProgressSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    workout: {
      type: Schema.Types.ObjectId,
      ref: "Workout",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    progress: [
      {
        exerciseId: { type: String, required: true },
        completedRepetitions: {
          type: Number,
          required: true,
          min: 0,
        },
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

userProgressSchema.index({ user: 1, workout: 1 }, { unique: true });

export default mongoose.models.UserProgress || model("UserProgress", userProgressSchema);
