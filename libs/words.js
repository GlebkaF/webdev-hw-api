import { ObjectId } from "mongodb";
import { connectToDatabase } from "./mongodb";

export async function getWords({ userId }) {
  const { db } = await connectToDatabase();
  return await db.collection("words").find({ userId }).toArray();
}

export async function getWordById({ id, userId }) {
  const { db } = await connectToDatabase();
  return await db
    .collection("words")
    .findOne({ _id: new ObjectId(id), userId });
}

export async function createWord({
  userId,
  name,
  translation,
  status,
  deadline,
}) {
  const { db } = await connectToDatabase();
  return await db
    .collection("words")
    .insertOne({ userId, name, translation, status, deadline });
}

export async function updateWord({
  userId,
  id,
  name,
  translation,
  status,
  deadline,
}) {
  const { db } = await connectToDatabase();
  return await db
    .collection("words")
    .updateOne(
      { _id: new ObjectId(id), userId },
      { $set: { name, translation, status, deadline } }
    );
}

export async function deleteWord({ id, userId }) {
  const { db } = await connectToDatabase();
  return await db
    .collection("words")
    .deleteOne({ _id: new ObjectId(id), userId });
}
