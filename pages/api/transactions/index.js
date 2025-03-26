import { addTransaction, getTransactions } from "@/libs/transaction";
import { getUserFromRequest } from "@/libs/users";
import Joi from "joi";

export default async function handler(req, res) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: "Пользователь не найден" });

    const userId = user._id;

    if (req.method === "GET") {
      return res.status(200).json(await getTransactions({ userId }));
    }

    const schema = Joi.object({
      description: Joi.string().required(),
      sum: Joi.number().integer().positive().strict().required(),
      category: Joi.string().required(),
      date: Joi.date().required(),
    }).messages({
      "any.required": `Поле {#label} обязательно для заполнения`,
      "string.empty": `Поле {#label} не может быть пустым`,
      "date.base": `Поле {#label} должно быть датой`,
      "number.base": "{#label} Должно быть числом",
    });

    const data = JSON.parse(req.body);

    console.log(data);

    if (req.method === "POST") {
      const { value, error } = schema.validate(data);

      if (error)
        return res.status(400).json({ error: error.details[0].message });

      await addTransaction({ userId, ...value });

      return res
        .status(201)
        .json({ transactions: await getTransactions({ userId }) });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
