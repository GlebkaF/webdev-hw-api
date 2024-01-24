import { ObjectId } from "mongodb";
import { connectToDatabase } from "./mongodb";

export async function getKanbanTasks({ userId }) {
  const { db } = await connectToDatabase();
  return await db.collection("kanbanTasks").find({ userId }).toArray();
}

export async function createKanbanTask({
  userId,
  title,
  topic,
  date,
  status,
  description,
}) {
  const { db } = await connectToDatabase();
  return await db
    .collection("kanbanTasks")
    .insertOne({ userId, title, topic, date, status, description });
}

export async function updateKanbanTask({
  userId,
  title,
  topic,
  date,
  status,
  description,
  id,
}) {
  const { db } = await connectToDatabase();
  return await db
    .collection("kanbanTasks")
    .updateOne(
      { _id: new ObjectId(id), userId },
      { $set: { userId, title, topic, date, status, description } }
    );
}

export async function deleteKanbanTask({ id, userId }) {
  const { db } = await connectToDatabase();
  return await db
    .collection("kanbanTasks")
    .deleteOne({ _id: new ObjectId(id), userId });
}
