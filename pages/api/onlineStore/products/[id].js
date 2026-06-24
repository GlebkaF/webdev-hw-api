import { connectToMongoose } from "@/libs/onlineStore";
import { Product } from "@/model/onlineStore/schema";

export default async function handler(req, res) {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
    try {
        await connectToMongoose();
        const { id } = req.query;
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ error: "Товар не найден" });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}