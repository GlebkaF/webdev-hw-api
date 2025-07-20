import { getUserByToken } from '@/libs/fitness';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const auth = req.headers.authorization;
  const token = auth?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Отсутствует Authorization токен' });

  try {
    const user = await getUserByToken(token);
    res.status(201).json({ user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
