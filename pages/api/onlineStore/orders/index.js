import authMiddleware from "@/middleware/auth-onlineStore";
import { connectToMongoose } from "@/libs/onlineStore";
import { Order, Product } from "@/model/onlineStore/schema";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    await authMiddleware(req, res, async () => {
        try {
            await connectToMongoose();
            const { name, phone, address, total, items } = req.body;
            if (!name || !phone || !address || !total || !items || !items.length) {
                return res.status(400).json({ error: "Все поля обязательны" });
            }

            // Проверяем, что все товары существуют и собираем их актуальные цены
            const productIds = items.map(i => i.productId);
            const products = await Product.find({ _id: { $in: productIds } });
            if (products.length !== productIds.length) {
                return res.status(400).json({ error: "Некоторые товары не найдены" });
            }

            // Формируем items с ценой на момент заказа
            const orderItems = items.map(i => {
                const product = products.find(p => p._id.toString() === i.productId);
                return {
                    productId: i.productId,
                    quantity: i.quantity,
                    priceAtOrder: product.price,
                };
            });

            // Создаём заказ
            const order = await Order.create({
                userId: req.userId,
                name,
                phone,
                address,
                total,
                items: orderItems,
            });

            // Увеличиваем популярность купленных товаров
            for (const item of orderItems) {
                await Product.findByIdAndUpdate(item.productId, {
                    $inc: { popularity: item.quantity },
                });
            }

            // Очищаем корзину пользователя
            const { Cart } = await import("@/model/onlineStore/schema");
            await Cart.findOneAndDelete({ userId: req.userId });

            res.status(201).json(order);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}