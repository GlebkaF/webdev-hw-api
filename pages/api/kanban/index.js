import { createKanbanTask, getKanbanTasks } from "@/libs/kanban";
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
      const { title, topic, status } = JSON.parse(req.body);

      // Схема валидации
      const schema = Joi.object({
        title: Joi.string().default("Новая задача"),
        topic: Joi.string().default("Research"),
        status: Joi.string().default("Без статуса"),
      });

      // Валидация данных
      const { error, value } = schema.validate({ title, topic, status });

      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      await createKanbanTask({
        userId,
        title: value.title,
        topic: value.topic,
        date: new Date(),
        status: value.status,
      });

      return res.status(201).json({ tasks: await getKanbanTasks({ userId }) });
    } else {
      res.status(200).json({ tasks: await getKanbanTasks({ userId }) });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
