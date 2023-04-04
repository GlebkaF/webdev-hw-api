// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getUsers, registerUser } from "@/libs/users";

const defaultUserImage =
  "https://storage.yandexcloud.net/skypro-webdev-homework-bucket/1680591910917-%25C3%2590%25C2%25A1%25C3%2590%25C2%25BD%25C3%2590%25C2%25B8%25C3%2590%25C2%25BC%25C3%2590%25C2%25BE%25C3%2590%25C2%25BA%2520%25C3%2591%25C2%258D%25C3%2590%25C2%25BA%25C3%2591%25C2%2580%25C3%2590%25C2%25B0%25C3%2590%25C2%25BD%25C3%2590%25C2%25B0%25202023-04-04%2520%25C3%2590%25C2%25B2%252014.04.40.png";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      try {
        const {
          login,
          name,
          password,
          imageUrl = defaultUserImage,
        } = JSON.parse(req.body);

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
          const user = await registerUser({ login, password, name, imageUrl });

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
