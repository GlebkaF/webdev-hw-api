import authMiddleware from "@/middleware/auth-onlineStore";
import { connectToMongoose } from "@/libs/onlineStore";
import { Cart } from "@/model/onlineStore/schema";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    await authMiddleware(req, res, async () => {
        try {
            await connectToMongoose();
            const { productId } = req.body;
            if (!productId) return res.status(400).json({ error: "productId обязателен" });

            let cart = await Cart.findOne({ userId: req.userId });
            if (!cart) {
                cart = new Cart({ userId: req.userId, items: [] });
            }

            const existingIndex = cart.items.findIndex(item => item.productId.toString() === productId);
            if (existingIndex > -1) {
                // Удаляем товар
                cart.items.splice(existingIndex, 1);
                await cart.save();
                return res.status(200).json({ message: "Товар удалён из корзины", inCart: false });
            } else {
                // Добавляем с quantity = 1
                cart.items.push({ productId, quantity: 1 });
                await cart.save();
                return res.status(200).json({ message: "Товар добавлен в корзину", inCart: true });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}