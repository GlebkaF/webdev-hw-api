import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@/model/onlineStore/schema";

let isConnected = false;

export async function connectToMongoose() {
    if (isConnected) return;
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB || "webdev-hw-api";
    if (!uri) throw new Error("MONGODB_URI не задан в .env");

    await mongoose.connect(uri, { dbName });
    isConnected = true;
}

// JWT
export function signToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return null;
    }
}

// Валидация email и пароля
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    if (password.length < 6) return "Пароль должен содержать не менее 6 символов";
    const specialCharCount = (password.match(/[^A-Za-z0-9]/g) || []).length;
    if (specialCharCount < 2) return "Пароль должен содержать не менее 2 спецсимволов";
    if (!/[A-Z]/.test(password)) return "Пароль должен содержать как минимум одну заглавную букву";
    return null;
}

async function getUserById(userId) {
    const user = await User.findOne({ _id: userId }, { projection: { password: 0 } });
    if (!user) throw new Error("Пользователь не найден");
    return user;
}

export async function registerUser({ email, password, name }) {
    await connectToMongoose();
    if (!validateEmail(email)) throw new Error("Введите корректный Email");
    const existing = await User.findOne({ email });
    if (existing) throw new Error("Пользователь с таким email уже существует");
    const err = validatePassword(password);
    if (err) throw new Error(err);
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashed, name });
}

export async function loginUser({ email, password }) {
    await connectToMongoose();
    const user = await User.findOne({ email });
    if (!user) throw new Error("Пользователь не найден");
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Неверный пароль");
    return signToken({ id: user._id });
}

export async function getUserByToken(token) {
    const decoded = verifyToken(token);
    if (!decoded) throw new Error("Невалидный токен");
    await connectToMongoose();
    return await getUserById(decoded.id);
}