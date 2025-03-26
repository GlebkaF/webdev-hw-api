import { addTransaction, getTransactions } from "@/libs/transaction";
import { getUserFromRequest } from "@/libs/users";
import Joi from "joi";

export default async function handler(req, res) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: "Пользователь не найден" });

    const userId = user._id;

    if (req.method === "GET") {
      const { sortBy: sortQuery, filterBy: filterQuery } = req.query;
      const schema = Joi.object({
        sortQuery: Joi.string().valid("date", "sum").optional(),
        filterQuery: Joi.string()
          .pattern(
            /^(food|transport|housing|joy|education|others)(,(food|transport|housing|joy|education|others))*$/
          )
          .optional(),
      });
      const { value, error } = schema.validate({ sortQuery, filterQuery });

      if (error)
        return res
          .status(400)
          .json({ message: "Неверно введены опции фильтрации/сортировки" });

      return res.status(200).json(
        await getTransactions({
          userId,
          querys: {
            filterQuery: value.filterQuery?.split(","),
            sortQuery: value.sortQuery,
          },
        })
      );
    }

    const schema = Joi.object({
      description: Joi.string().required(),
      sum: Joi.number().integer().positive().strict().required(),
      category: Joi.string()
        .valid("food", "transport", "housing", "joy", "education", "others")
        .required(),
      date: Joi.date().required(),
    }).messages({
      "any.required": `Поле {#label} обязательно для заполнения`,
      "string.empty": `Поле {#label} не может быть пустым`,
      "date.base": `Поле {#label} должно быть датой`,
      "number.base": "{#label} должно быть числом",
      "any.only":
        'Для {#label} Допустимы только значения "food", "transport", "housing", "joy", "education", "others" ',
    });

    if (req.method === "POST") {
      const data = JSON.parse(req.body);

      const { value, error } = schema.validate(data);

      if (error)
        return res.status(400).json({ error: error.details[0].message });

      await addTransaction({ userId, ...value });

      return res
        .status(201)
        .json({ transactions: await getTransactions({ userId }) });
    }

    res.status(200).json({ message: "Запрос прошел, но метод выбран неверно" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
