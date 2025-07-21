import Joi from "joi";
import dbConnect from "@/libs/fitness/dbConnect";
import User from "@/libs/fitness/models/User";

const passwordSchema = Joi.string()
  .min(6)
  .required()
  .custom((value, helpers) => {
    if (!/[A-Z]/.test(value))
      return helpers.message("Пароль должен содержать хотя бы одну заглавную букву");
    const specialChars = (value.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length;
    if (specialChars < 2) return helpers.message("Пароль должен содержать минимум 2 спецсимвола");
    return value;
  });

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: passwordSchema,
  name: Joi.string(),
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  await dbConnect();

  try {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password, name } = value;

    const candidate = await User.findOne({ email });
    if (candidate) {
      return res.status(400).json({ message: "Пользователь с таким email уже существует" });
    }

    const user = new User({ email, password, name });
    await user.save();

    res.status(201).json({ message: "Пользователь успешно создан" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}
