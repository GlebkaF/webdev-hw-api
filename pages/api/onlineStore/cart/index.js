import authMiddleware from "@/middleware/auth-onlineStore";
import { connectToMongoose } from "@/libs/onlineStore";
import { Cart } from "@/model/onlineStore/schema";

export default async function handler(req, res) {
    await authMiddleware(req, res, async () => {
        try {
            await connectToMongoose();
            if (req.method === "GET") {
                let cart = await Cart.findOne({ userId: req.userId }).populate("items.productId");
                if (!cart) cart = { userId: req.userId, items: [] };
                return res.status(200).json(cart);
            }
            if (req.method === "DELETE") {
                await Cart.findOneAndDelete({ userId: req.userId });
                return res.status(200).json({ message: "Корзина очищена" });
            }
            res.status(405).json({ error: "Method not allowed" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}