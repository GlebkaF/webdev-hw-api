import Joi from "joi";

let lastId = 1;

export let leaders = [
  {
    id: generateId(),
    name: "Великий маг",
    time: 1,
  },
  {
    id: generateId(),
    name: "Карточный мастер",
    time: 1,
  },
  {
    id: generateId(),
    name: "Гениальный игрок",
    time: 1,
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

      const todo = {
        id: generateId(),
        name: value.name,
        time: value.time,
      };

      leaders.push(todo);
      return res.status(201).json({ leaders: getleaders() });
    } else {
      res.status(200).json({ leaders: getleaders() });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export function setUser(newLeaders) {
  leaders = newLeaders;
}

export function getleaders() {
  console.log([...leaders].sort((a, b) => a - b));
  return [...leaders].sort((a, b) => a - b).slice(0, 10);
}

export function generateId() {
  return lastId++;
}
