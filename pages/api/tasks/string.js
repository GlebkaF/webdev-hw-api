let string = "";

export default function handler(req, res) {
  if (req.method === "POST") {
    try {
      string = JSON.parse(req.body).string;

      if (typeof string !== "string") {
        return res.status(400).json({ error: "Передана не строка" });
      }

      return res.status(201).json({ string });
    } catch (error) {
      console.error(error);

      return res.status(400).json({ error: "В теле запроса невалидный JSON" });
    }
  } else if (req.method === "DELETE") {
    string = "";
    return res.status(200).json({ string });
  }
  res.status(200).json({ string });
}
