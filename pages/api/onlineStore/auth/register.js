import { registerUser } from "@/libs/onlineStore";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    try {
        const body = JSON.parse(req.body);
        const { email, password, name } = body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: "Все поля обязательны" });
        }

        await registerUser({ email, password, name });
        res.status(201).json({ message: "Регистрация успешна" });
    } catch (err) {
        res.status(400).json({ error: err.message || "Неверный формат данных" });
    }
}