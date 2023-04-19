import { ObjectId } from "mongodb";
import { connectToDatabase } from "./mongodb";

export async function addPost({ user, description, imageUrl, key }) {
  const { db } = await connectToDatabase();

  const comment = {
    createdAt: new Date(),
    imageUrl,
    likes: [],
    description,
    user,
    key,
  };

  await db.collection("instapro_posts").insertOne(comment);

  return comment;
}

export async function getPosts({ key, limit = 20 }) {
  const { db } = await connectToDatabase();

  const posts = await db
    .collection("instapro_posts")
    .find({
      key,
    })
    .sort({
      createdAt: -1,
    })
    .limit(limit)
    .toArray();

  return posts;
}

export async function getUserPosts({ key, id, limit = 20 }) {
  const { db } = await connectToDatabase();
  console.log({ id });
  const posts = await db
    .collection("instapro_posts")
    .find({
      key,
      "user._id": new ObjectId(id),
    })
    .sort({
      createdAt: -1,
    })
    .limit(limit)
    .toArray();

  return posts;
}

export async function findPost(id) {
  const { db } = await connectToDatabase();

  return db.collection("instapro_posts").findOne({ _id: new ObjectId(id) });
}

export async function likePost({ user, id }) {
  if (!user) {
    throw new Error("Не передан юзер");
  }

  const post = await findPost(id);

  if (!post) {
    throw new Error("Комментарий не найден");
  }

  const { db } = await connectToDatabase();

  return db.collection("instapro_posts").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        likes: [
          ...post.likes.filter(({ login }) => user.login !== login),
          user,
        ],
      },
    }
  );
}

export async function dislikePost({ user, id }) {
  if (!user) {
    throw new Error("Не передан юзер");
  }

  const post = await findPost(id);

  if (!post) {
    throw new Error("Комментарий не найден");
  }

  const { db } = await connectToDatabase();

  return db.collection("instapro_posts").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        likes: post.likes.filter(({ login }) => user.login !== login),
      },
    }
  );
}

export function mapPost(post, user) {
  return {
    id: post._id,
    imageUrl: post.imageUrl,
    createdAt: post.createdAt,
    description: post.description,
    user: {
      id: post.user._id,
      name: post.user.name,
      login: post.user.login,
      imageUrl: post.user.imageUrl,
    },
    likes: post.likes.map((like) => ({
      id: like._id,
      name: like.name,
    })),
    isLiked: !!post.likes.find((like) => like.login === user?.login),
  };
}

export async function deletePost({ id }) {
  const { db } = await connectToDatabase();

  return db.collection("instapro_posts").deleteOne({ _id: new ObjectId(id) });
}
