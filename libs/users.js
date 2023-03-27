let lastId = 1;
const users = [];

registerUser({ login: "admin", password: "admin", name: "Админ Глеб" });

export async function loginUser({ login, password }) {
  const users = await getUsers();
  return (
    users.find((user) => user.login === login && user.password === password) ??
    null
  );
}

export async function getUserByToken({ token }) {
  const users = await getUsers();
  return users.find((user) => user.token === token) ?? null;
}

export async function getUserByLogin({ login }) {
  return users.find((user) => user.login === login) ?? null;
}

export async function getUsers() {
  //   Airtable.configure({
  //     apiKey:
  //       "pat0irELfLH988qJd.47d24128e63ecaf322bdb597d0517a26b29bd97477708ed2367159f6e232db4f",
  //   });

  //   const asd = await Airtable.base("webdev-hw-api").table("users");
  const asd = 1;
  console.log({ asd });

  return users;
}

export async function registerUser({ login, password, name }) {
  const existingUser = await getUserByLogin({ login });

  if (existingUser) {
    throw new Error("Пользователь с таким логином уже существует");
  }

  const user = {
    id: generateId(),
    login,
    password,
    name,
    token: `${login}:${password}:${name}`
      .split("")
      .map((s) => (s.codePointAt() << 2).toString("36"))
      .join(""),
  };
  users.push(user);
  return user;
}

function generateId() {
  return lastId++;
}

export async function getUserFromRequest(req) {
  const authorizationHeader = req.headers.authorization ?? "";

  const [_, token] = authorizationHeader.split(" ");
  const user = await getUserByToken({ token });

  if (!user) {
    return null;
  }

  return user;
}
