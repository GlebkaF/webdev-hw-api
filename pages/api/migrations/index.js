import {seedDatabase} from "@/migrations/fitness/init_db";

export default async function handler(req, res) {
    try {
        await seedDatabase()
        res.status(200).json({message: 'Добавил данные в базу'});
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}