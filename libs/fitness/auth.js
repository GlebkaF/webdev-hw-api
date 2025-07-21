import jwt from "jsonwebtoken";

export const verifyToken = (req) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("Укажите значение переменной JWT_SECRET в .env.local");
  }
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error("Не был передан заголовок Authorization");
    }

    const token = authHeader.split(" ")[1]; // "Bearer TOKEN"
    if (!token) {
      throw new Error("Не был передан токен");
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    console.error("Token verification failed:", err.message);
    throw new Error("Invalid Token");
  }
};
