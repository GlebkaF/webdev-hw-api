import { connectToDatabase } from "./mongodb";

export async function getTransactions({ userId }) {
  const { db } = await connectToDatabase();
  return await db.collection("transactions").find({ userId }).toArray();
}

export async function addTransaction({
  description,
  category,
  date,
  sum,
  userId,
}) {
  const { db } = await connectToDatabase();

  const transaction = {
    userId,
    description,
    category,
    date,
    sum,
  };

  return await db.collection("transactions").insertOne(transaction);
}
