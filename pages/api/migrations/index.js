import { seedOnlineStore } from "@/migrations/onlineStore/seed";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const result = await seedOnlineStore();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}