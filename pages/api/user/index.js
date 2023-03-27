// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getUsers, registerUser } from "@/libs/users";

export default async function handler(req, res) {
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
          const user = await registerUser({ login, password, name });

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
    const asd = await getUsers();
    return res.status(200).json({
      users: asd.map((user) => {
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
