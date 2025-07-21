import mongoose, { Schema, model } from "mongoose";

const exerciseSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: false },
});

const workoutSchema = new Schema(
  {
    name: { type: String, required: true },
    video: { type: String, required: true },
    exercises: [exerciseSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Workout || model("Workout", workoutSchema);
