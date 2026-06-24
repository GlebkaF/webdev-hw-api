import { registerUser } from "@/libs/onlineStore";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ error: "Все поля обязательны" });
        }
        await registerUser({ email, password, name });
        res.status(201).json({ message: "Регистрация успешна" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}