import { loginUser } from '@/libs/fitness';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = JSON.parse(req.body);

  try {
    const token = await loginUser({ email, password });
    res.status(200).json({ token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}