import Joi from "joi";

let lastId = 1;

function generateId() {
  return lastId++;
}

let leaders = [
  {
    id: generateId(),
    name: "Великий маг",
    time: 21,
  },
  {
    id: generateId(),
    name: "Карточный мастер",
    time: 52,
  },
  {
    id: generateId(),
    name: "Гениальный игрок",
    time: 71,
  },
];

export default function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { name, time } = JSON.parse(req.body);

      // Схема валидации
      const schema = Joi.object({
        name: Joi.string().default("Пользователь"),
        time: Joi.number().required(),
      });

      // Валидация данных
      const { error, value } = schema.validate({ name, time });

      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const leader = {
        id: generateId(),
        name: value.name,
        time: value.time,
      };

      leaders.push(leader);
      return res.status(201).json({ leaders: getLeaders() });
    } else {
      res.status(200).json({ leaders: getLeaders() });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

function getLeaders() {
  return leaders;
}
