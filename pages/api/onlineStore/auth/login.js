import { loginUser } from "@/libs/onlineStore";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email и пароль обязательны" });
        }
        const token = await loginUser({ email, password });
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}