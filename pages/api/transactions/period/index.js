import { getTransactionsByPeriod } from "@/libs/transaction";
import { getUserFromRequest } from "@/libs/users";
import Joi from "joi";

export default async function handler(req, res) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: "Пользователь не найден" });

    const userId = user._id;

    if (req.method === "GET") {
      const { start, end } = JSON.parse(req.body);

      const schema = Joi.date().required();

      const { error: startError } = schema.validate(start);
      const { error: endError } = schema.validate(end);

      if (startError)
        return res.status(401).json({ error: "Неверно указан start или end" });
      if (endError)
        return res.status(401).json({ error: "Неверно указан start или end" });

      return res.status(200).json(
        await getTransactionsByPeriod({
          userId,
          start,
          end,
        })
      );
    }

    res.status(200).json({ message: "Запрос прошел, но метод выбран неверно" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
