export default function handler(req, res) {
  res
    .status(500)
    .json({ error: "Ошибка сервера, обратитесь к системному администратору" });
}
