import { createWord, getWords } from "@/libs/words";
import { getUserFromRequest } from "@/libs/users";
import Joi from "joi";

export default async function handler(req, res) {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return res.status(401).json({ error: "Пользователь не найден" });
    }

    const userId = user._id;

    if (req.method === "POST") {
      const { name, translation, status, deadline } = JSON.parse(req.body);

      // Схема валидации
      const schema = Joi.object({
        name: Joi.string().required(),
        translation: Joi.string().required(),
        status: Joi.string().default("new"),
        deadline: Joi.alternatives().try(Joi.string().allow(null), Joi.date()),
      });

      // Валидация данных
      const { error, value } = schema.validate({ name, translation, status, deadline });

      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      await createWord({
        userId,
        name: value.name,
        translation: value.translation,
        status: value.status,
        deadline: value.deadline,
      });

      return res.status(201).json({ words: await getWords({ userId }) });
    } else {
      res.status(200).json({ words: await getWords({ userId }) });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
