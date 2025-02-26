import {
  deleteWord,
  getWordById,
  getWords,
  updateWord,
} from "@/libs/words";
import { getUserFromRequest } from "@/libs/users";
import Joi from "joi";

export default async function handler(req, res) {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return res.status(401).json({ error: "Пользователь не найден" });
    }

    const userId = user._id;

    if (req.method === "PUT") {
      const { name, translation, status, deadline } = JSON.parse(req.body);
      const { id } = req.query;

      // Схема валидации
      const schema = Joi.object({
        name: Joi.string().required(),
        translation: Joi.string().required(),
        status: Joi.string().default("new"),
        deadline: Joi.alternatives().try(Joi.string().allow(null), Joi.date()),
        id: Joi.string().required(),
      });

      // Валидация данных
      const { error, value } = schema.validate({ name, translation, status, deadline, id });

      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      await updateWord({
        userId,
        id: value.id,
        name: value.name,
        translation: value.translation,
        status: value.status,
        deadline: value.deadline,
      });

      return res.status(201).json({ words: await getWords({ userId }) });
    } else if (req.method === "DELETE") {
      const { id } = req.query;

      await deleteWord({ id, userId });

      return res.status(201).json({ words: await getWords({ userId }) });
    } else {
      const { id } = req.query;

      const word = await getWordById({ id, userId });

      if (!word) {
        return res.status(404).json({ error: "Слово не найдено" });
      }

      return res.status(200).json({ word });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
