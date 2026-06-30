import { loginUser } from "@/libs/onlineStore";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    try {
        const body = JSON.parse(req.body);
        const { email, password } = body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email и пароль обязательны" });
        }

        const token = await loginUser({ email, password });
        res.status(200).json({ token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}