import { getWorkoutById, verifyToken } from '@/libs/fitness';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const auth = req.headers.authorization;
  const token = auth?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Отсутствует Authorization токен' });

  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ message: 'Невалидный токен' });

  const { id } = req.query;
  if (!id) return res.status(400).json({ message: 'ID тренировки должен быть указан' });

  try {
    const workout = await getWorkoutById(id);
    res.status(200).json(workout);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
