// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

let lastId = 1;

function createComment(text, authorName, date = new Date()) {
  return {
    id: generateId(),
    date,
    likes: 0,
    isLiked: false,
    text,
    author: {
      name: authorName,
    },
  };
}

const comments = {
  "gleb-fokin": [createComment("Это мой первый лайк", "Глеб Фокин")],
};

export default function handler(req, res) {
  const key = req.query.key;

  if (key === ":personal-key") {
    return res.status(400).json({
      error:
        "Замените :personal-key в адресе на свое имя или фамилию, например gleb-fokin",
    });
  }

  try {
    if (req.method === "POST") {
      try {
        const { text, name, forceError } = JSON.parse(req.body);

        if (forceError) {
          if (Math.random() > 0.5) {
            return res
              .status(500)
              .json({ error: "Извините сервер упал, попробуйте позже" });
          }
        }

        if (!text) {
          return res.status(400).json({ error: "В теле не передан text" });
        }

        if (!name) {
          return res.status(400).json({ error: "В теле не передан name" });
        }

        if (name.length < 3) {
          return res
            .status(400)
            .json({ error: "name должен содержать хотя бы 3 символа" });
        }

        if (text.length < 3) {
          return res
            .status(400)
            .json({ error: "text должен содержать хотя бы 3 символа" });
        }

        addComment(key, createComment(text, name));

        return res.status(201).json({ result: "ok" });
      } catch (error) {
        console.error(error);

        return res
          .status(400)
          .json({ error: "В теле запроса невалидный JSON" });
      }
    }
    res.status(200).json({ comments: getComments(key) });
    return;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export function addComment(key, comment) {
  comments[key] = [...getComments(key), comment];
}

export function getComments(key) {
  if (!comments[key]) {
    comments[key] = [
      createComment(
        "Это мой первый комментарий",
        "Глеб Фокин",
        new Date("2023-01-01T08:19:00.916Z")
      ),
    ];
  }

  return comments[key] ?? [];
}

export function generateId() {
  return lastId++;
}
