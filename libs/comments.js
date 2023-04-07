import { ObjectId } from "mongodb";
import { connectToDatabase } from "./mongodb";
import { getUserByLogin } from "./users";

export async function addComment({ key, user, text, likes = [] }) {
  const { db } = await connectToDatabase();

  const comment = {
    date: new Date(),
    likes,
    text,
    user,
    key,
  };

  await db.collection("comments").insertOne(comment);

  return comment;
}

export async function getComments(key) {
  const { db } = await connectToDatabase();

  const comments = await db.collection("comments").find({ key }).toArray();

  if (comments.length !== 0) {
    return comments;
  }

  const admin = await getUserByLogin({ login: "admin" });

  await addComment({
    text: "Буду первым",
    user: admin,
    key,
    likes: [admin],
  });

  return getComments(key);
}

export async function findComment(id) {
  const { db } = await connectToDatabase();

  return db.collection("comments").findOne({ _id: new ObjectId(id) });
}

export async function toggleLike({ user, id }) {
  if (!user) {
    throw new Error("Не передан юзер");
  }

  const comment = await findComment(id);

  if (!comment) {
    throw new Error("Комментарий не найден");
  }

  const isLiked = !!comment.likes.find(({ login }) => user.login === login);

  const newLikes = isLiked
    ? comment.likes.filter(({ login }) => user.login !== login)
    : [...comment.likes, user];

  const { db } = await connectToDatabase();

  await db.collection("comments").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        likes: newLikes,
      },
    }
  );

  return {
    likes: newLikes.length,
    isLiked: !isLiked,
  };
}

export async function deleteComment({ id }) {
  const { db } = await connectToDatabase();

  return db.collection("comments").deleteOne({ _id: new ObjectId(id) });
}
