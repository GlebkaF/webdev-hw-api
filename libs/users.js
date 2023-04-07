import { connectToDatabase } from "./mongodb";

export async function loginUser({ login, password }) {
  const { db } = await connectToDatabase();
  return db.collection("users").findOne({ login, password });
}

export async function getUserByToken({ token }) {
  const { db } = await connectToDatabase();
  return db.collection("users").findOne({ token });
}

export async function getUserByLogin({ login }) {
  const { db } = await connectToDatabase();
  return db.collection("users").findOne({ login });
}

export async function getUsers() {
  const { db } = await connectToDatabase();

  return db.collection("users").find({}).toArray();
}

export async function registerUser({ login, password, name, imageUrl }) {
  const { db } = await connectToDatabase();
  const existingUser = await db.collection("users").findOne({ login });

  if (existingUser) {
    throw new Error("Пользователь с таким логином уже существует");
  }

  const user = {
    login,
    password,
    name,
    imageUrl,
    token: `${login}:${password}:${name}`
      .split("")
      .map((s) => (s.codePointAt() << 2).toString("36"))
      .join(""),
  };

  await db.collection("users").insertOne(user);

  return user;
}

export async function getUserFromRequest(req) {
  const authorizationHeader = req.headers.authorization ?? "";

  const [_, token] = authorizationHeader.split(" ");

  if (!token) {
    return null;
  }

  const user = await getUserByToken({ token });

  if (!user && token) {
    throw new Error(
      "authorization заголовок передан, но юзера с переданным токеном не сущетсвует. Возможно вы опечатались в значении заголовка?"
    );
  }

  return user;
}
