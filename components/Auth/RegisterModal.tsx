import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Logo from "../Logo/Logo";
import styles from "./StyleModal.module.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RegisterModalProps = {
    onClose: () => void;
};

export default function RegisterModal({ onClose }: RegisterModalProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({
        email: false,
        password: false,
        confirmPassword: false,
    });

    const { register, isLoading } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setFieldErrors({
            email: false,
            password: false,
            confirmPassword: false,
        });

        // Фронтенд-валидация
        if (!email.trim()) {
            setFieldErrors((prev) => ({ ...prev, email: true }));
            setError("Введите адрес электронной почты");
            return;
        }
        if (!EMAIL_REGEX.test(email)) {
            setFieldErrors((prev) => ({ ...prev, email: true }));
            setError("Введите корректный email");
            return;
        }
        if (!password.trim()) {
            setFieldErrors((prev) => ({ ...prev, password: true }));
            setError("Введите пароль");
            return;
        }
        if (!confirmPassword.trim()) {
            setFieldErrors((prev) => ({ ...prev, confirmPassword: true }));
            setError("Повторите пароль");
            return;
        }
        if (password !== confirmPassword) {
            setFieldErrors((prev) => ({
                ...prev,
                password: true,
                confirmPassword: true,
            }));
            setError("Пароли не совпадают");
            return;
        }

        // Запрос к серверу
        try {
            await register(email, password);
            onClose();
        } catch (err: unknown) {
            
            // Универсальное сообщение для любой ошибки регистрации
            let message = "Неверные данные. Проверьте почту и пароль";
            let highlight: "email" | "password" | null = "email";

            if (err instanceof Error) {
                const lowerMsg = err.message.toLowerCase();

                // Если сервер ВДРУГ вернул конкретику — используем её
                if (
                    lowerMsg.includes("already") ||
                    lowerMsg.includes("существует") ||
                    lowerMsg.includes("registered")
                ) {
                    message = "Пользователь с таким email уже зарегистрирован";
                    highlight = "email";
                } else if (
                    lowerMsg.includes("password") ||
                    lowerMsg.includes("пароль") ||
                    lowerMsg.includes("требования")
                ) {
                    message = "Пароль не соответствует требованиям";
                    highlight = "password";
                }
                // Для всего остального (400 без текста, сеть, таймаут) — универсальное сообщение
            }

            setError(message);
            if (highlight) {
                setFieldErrors((prev) => ({ ...prev, [highlight]: true }));
            }
        }
    };

    return (
        <>
            <div className={styles.backdrop} onClick={onClose} />
            <div className={styles.authPage}>
                <div
                    className={styles.authModal}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Logo />
                    <form
                        onSubmit={handleSubmit}
                        className={styles.form}
                        noValidate
                    >
                        <input
                            type="email"
                            placeholder="Эл. почта"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setFieldErrors((prev) => ({
                                    ...prev,
                                    email: false,
                                }));
                            }}
                            className={`${styles.input} ${fieldErrors.email ? styles.inputError : ""}`}
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setFieldErrors((prev) => ({
                                    ...prev,
                                    password: false,
                                }));
                            }}
                            className={`${styles.input} ${fieldErrors.password ? styles.inputError : ""}`}
                        />
                        <input
                            type="password"
                            placeholder="Повторите пароль"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setFieldErrors((prev) => ({
                                    ...prev,
                                    confirmPassword: false,
                                }));
                            }}
                            className={`${styles.input} ${fieldErrors.confirmPassword ? styles.inputError : ""}`}
                        />
                        {error && <div className={styles.error}>{error}</div>}
                        <button
                            type="submit"
                            className={`${styles.btnAuth} btn-primary`}
                            disabled={isLoading}
                        >
                            {isLoading
                                ? "Регистрация..."
                                : "Зарегистрироваться"}
                        </button>
                        <Link
                            href="/?modal=login"
                            className={`${styles.btnAuth} btn-secondary`}
                            onClick={(e) => {
                                e.preventDefault();
                                onClose();
                                router.push("/?modal=login", undefined, {
                                    shallow: true,
                                });
                            }}
                        >
                            Войти
                        </Link>
                    </form>
                </div>
            </div>
        </>
    );
}
