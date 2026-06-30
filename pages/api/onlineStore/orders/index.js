import authMiddleware from "@/middleware/auth-onlineStore";
import { connectToMongoose } from "@/libs/onlineStore";
import { Order, Product } from "@/model/onlineStore/schema";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    await authMiddleware(req, res, async () => {
        try {
            const body = JSON.parse(req.body);
            const { name, phone, address, total, items } = body;

            if (!name || !phone || !address || !total || !items || !items.length) {
                return res.status(400).json({ error: "Все поля обязательны" });
            }

            await connectToMongoose();

            // Проверяем товары
            const productIds = items.map(i => i.productId);
            const products = await Product.find({ _id: { $in: productIds } });
            if (products.length !== productIds.length) {
                return res.status(400).json({ error: "Некоторые товары не найдены" });
            }

            const orderItems = items.map(i => {
                const product = products.find(p => p._id.toString() === i.productId);
                return {
                    productId: i.productId,
                    quantity: i.quantity,
                    priceAtOrder: product.price,
                };
            });

            const order = await Order.create({
                userId: req.userId,
                name,
                phone,
                address,
                total,
                items: orderItems,
            });

            // Увеличиваем популярность
            for (const item of orderItems) {
                await Product.findByIdAndUpdate(item.productId, {
                    $inc: { popularity: item.quantity },
                });
            }

            // Очищаем корзину
            const { Cart } = await import("@/model/onlineStore/schema");
            await Cart.findOneAndDelete({ userId: req.userId });

            res.status(201).json(order);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}