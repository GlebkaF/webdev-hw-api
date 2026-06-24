import { connectToMongoose } from "@/libs/onlineStore";
import { Product } from "@/model/onlineStore/schema";

export default async function handler(req, res) {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
    try {
        await connectToMongoose();
        const { q } = req.query;
        if (!q) return res.status(400).json({ error: "Параметр q обязателен" });

        const regex = new RegExp(q, "i");
        const products = await Product.find({
            $or: [{ name: regex }, { description: regex }],
        });

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}