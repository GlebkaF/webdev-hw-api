import { getTransactionsByPeriod } from "@/libs/transaction";
import { getUserFromRequest } from "@/libs/users";
import Joi from "joi";

export default async function handler(req, res) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: "Пользователь не найден" });

    const userId = user._id;

    if (req.method === "GET") {
      const { period } = JSON.parse(req.body);

      const schema = Joi.date().required();

      const { value, error } = schema.validate(period);

      if (error)
        return res.status(401).json({ error: error.details[0].message });

      return res.status(200).json(
        await getTransactionsByPeriod({
          userId,
          date: period,
        })
      );
    }

    res.status(200).json({ message: "Запрос прошел, но метод выбран неверно" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
