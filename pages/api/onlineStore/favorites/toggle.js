import authMiddleware from "@/middleware/auth-onlineStore";
import { connectToMongoose } from "@/libs/onlineStore";
import { Favorite } from "@/model/onlineStore/schema";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    await authMiddleware(req, res, async () => {
        try {
            const body = JSON.parse(req.body);
            const { productId } = body;

            if (!productId) {
                return res.status(400).json({ error: "productId обязателен" });
            }

            await connectToMongoose();
            const existing = await Favorite.findOne({ userId: req.userId, productId });
            if (existing) {
                await Favorite.deleteOne({ _id: existing._id });
                return res.status(200).json({ message: "Удалено из избранного", isFavorite: false });
            } else {
                await Favorite.create({ userId: req.userId, productId });
                return res.status(200).json({ message: "Добавлено в избранное", isFavorite: true });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}