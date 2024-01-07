import { connectToDatabase } from "./mongodb";

export async function getKanbanTasks({ userId }) {
  const { db } = await connectToDatabase();
  return await db.collection("kanbanTasks").find({ userId }).toArray();
}

export async function createKanbanTask({ userId, title, topic, date, status }) {
  const { db } = await connectToDatabase();
  return await db
    .collection("kanbanTasks")
    .insertOne({ userId, title, topic, date, status });
}
