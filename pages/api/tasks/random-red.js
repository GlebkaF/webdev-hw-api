export default function handler(req, res) {
  const colors = [
    "tomato",
    "coral",
    "salmon",
    "red",
    "crimson",
    "darkred",
    "firebrick",
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];
  res.status(200).json({ color });
}
