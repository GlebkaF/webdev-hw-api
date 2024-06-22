import {
  createKanbanTask,
  deleteKanbanTask,
  getKanbanTaskById,
  getKanbanTasks,
  updateKanbanTask,
} from "@/libs/kanban";
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
      const { title, topic, status, date, description } = JSON.parse(req.body);
      const { id } = req.query;

      // Схема валидации
      const schema = Joi.object({
        title: Joi.string().default("Новая задача"),
        topic: Joi.string().default("Research"),
        status: Joi.string().default("Без статуса"),
        date: Joi.date().default(new Date()),
        description: Joi.string().default(""),
        id,
      });

      // Валидация данных
      const { error, value } = schema.validate({
        title,
        topic,
        status,
        description,
        id,
        date,
      });

      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      await updateKanbanTask({
        userId,
        title: value.title,
        topic: value.topic,
        date: value.date,
        description: value.description,
        status: value.status,
        id: value.id,
      });

      return res.status(201).json({ tasks: await getKanbanTasks({ userId }) });
    } else if (req.method === "DELETE") {
      const { id } = req.query;

      await deleteKanbanTask({ id, userId });

      return res.status(201).json({ tasks: await getKanbanTasks({ userId }) });
    } else {
      const { id } = req.query;

      const task = await getKanbanTaskById({ id, userId });

      if (!task) {
        return res.status(404).json({ error: "Задача не найдена" });
      }

      return res.status(200).json({ task });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
