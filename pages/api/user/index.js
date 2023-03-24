// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

let lastId = 1;
const users = [];

registerUser({ login: "admin", password: "admin", name: "Админ Глеб" });

export default function handler(req, res) {
  try {
    if (req.method === "POST") {
      try {
        const { login, name, password } = JSON.parse(req.body);

        if (!login) {
          return res.status(400).json({ error: "В теле не передан text" });
        }

        if (!password) {
          return res.status(400).json({ error: "В теле не передан password" });
        }

        if (!name) {
          return res.status(400).json({ error: "В теле не передан name" });
        }

        if (login.length < 3) {
          return res
            .status(400)
            .json({ error: "login должен содержать хотя бы 3 символа" });
        }

        if (password.length < 3) {
          return res
            .status(400)
            .json({ error: "password должен содержать хотя бы 3 символа" });
        }

        if (name.length < 3) {
          return res
            .status(400)
            .json({ error: "name должен содержать хотя бы 3 символа" });
        }

        try {
          const user = registerUser({ login, password, name });

          return res.status(201).json({ user });
        } catch (error) {
          return res.status(400).json({
            error: error.message,
          });
        }
      } catch (error) {
        console.error(error);

        return res
          .status(400)
          .json({ error: "В теле запроса невалидный JSON" });
      }
    }
    return res.status(200).json({
      users: users.map((user) => {
        return {
          id: user.id,
          login: user.login,
          name: user.name,
        };
      }),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export function loginUser({ login, password }) {
  return (
    users.find((user) => user.login === login && user.password === password) ??
    null
  );
}

export function getUserByToken({ token }) {
  return users.find((user) => user.token === token) ?? null;
}

export function getUserByLogin({ login }) {
  return users.find((user) => user.login === login) ?? null;
}

function registerUser({ login, password, name }) {
  const existingUser = getUserByLogin({ login });

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
