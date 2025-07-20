import { verifyToken } from '@/libs/fitness';
import { markWorkoutProgress, getWorkoutProgress } from '@/libs/fitness';

export default async function handler(req, res) {
  const auth = req.headers.authorization;
  const token = auth?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Отсутствует Authorization токен' });

  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ message: 'Невалидный токен' });

  if (req.method === 'POST') return markWorkoutProgressHandler(decoded.id, req, res);
  
  if (req.method === 'GET') return getWorkoutProgressHandler(decoded.id, req, res);

  return res.status(405).end();
}

async function markWorkoutProgressHandler(userDecodedId, req, res) {
  const { workoutId, progressData } = JSON.parse(req.body);
  if (!workoutId) return res.status(400).json({ message: 'ID тренировки должен быть указан' });

  try {
    await markWorkoutProgress(userDecodedId, workoutId, progressData);
    res.status(200).json({ message: 'Прогресс по данной тренировке отмечен!' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function getWorkoutProgressHandler(userDecodedId,req, res) {
  const { workoutId } = JSON.parse(req.body);
  if (!workoutId) return res.status(400).json({ message: 'ID тренировки должен быть указан' });

  try {
    const progress = await getWorkoutProgress(userDecodedId, workoutId);
    res.status(200).json({progress});
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
