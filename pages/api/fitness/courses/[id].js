import {getCourseById} from '@/libs/fitness';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { id } = req.query;

  try {
    const courses = await getCourseById(id);
    res.status(200).json(courses);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
