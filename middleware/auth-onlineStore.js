import { getUserByToken } from "@/libs/onlineStore";

export default async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Требуется авторизация" });
        }
        const token = authHeader.split(" ")[1];
        const user = await getUserByToken(token);
        req.userId = user._id;
        next();
    } catch (error) {
        return res.status(401).json({ error: error.message || "Ошибка авторизации" });
    }
}