import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Logo from "../Logo/Logo";
import styles from "./StyleModal.module.css";

// Проверка формата email
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LoginModalProps = {
    onClose: () => void;
};

export default function LoginModal({ onClose }: LoginModalProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({
        email: false,
        password: false,
    });

    const { login, isLoading } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setFieldErrors({ email: false, password: false });

        // 1. Проверка: пустое поле email
        if (!email.trim()) {
            setFieldErrors((prev) => ({ ...prev, email: true }));
            setError("Введите адрес электронной почты");
            return;
        }

        // 2. Проверка: формат email
        if (!EMAIL_REGEX.test(email)) {
            setFieldErrors((prev) => ({ ...prev, email: true }));
            setError("Введите корректный email (например: name@example.com)");
            return;
        }

        // 3. Проверка: пустое поле пароль
        if (!password.trim()) {
            setFieldErrors((prev) => ({ ...prev, password: true }));
            setError("Введите пароль");
            return;
        }

        try {
            await login(email, password);
            onClose();
                } catch (err: unknown) {

            // 1. Начинаем с универсального сообщения для ошибок авторизации
            let message = "Неверные данные. Проверьте почту и пароль";
            
            if (err instanceof Error) {
                const lowerMsg = err.message.toLowerCase();
                
                // 2. Если сервер явно сказал "не найден" — показываем это
                if (lowerMsg.includes("not found") || lowerMsg.includes("не найден")) {
                    message = "Пользователь с таким email не найден";
                    setFieldErrors((prev) => ({ ...prev, email: true }));
                } 
                // 3. Если сервер явно сказал про пароль — показываем это
                else if (lowerMsg.includes("password") || lowerMsg.includes("пароль") || lowerMsg.includes("неверн")) {
                    message = "Неверный пароль";
                    setFieldErrors((prev) => ({ ...prev, password: true }));
                }
                // 4. Для всего остального (включая "400") оставляем универсальное сообщение
                // (явное условие для 400 не нужно, так как это уже значение по умолчанию)
            }
            
            // 5. Гарантированно показываем сообщение
            setError(message);
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
                            placeholder="Логин"
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

                        {error && <div className={styles.error}>{error}</div>}

                        <button
                            type="submit"
                            className={`${styles.btnAuth} btn-primary`}
                            disabled={isLoading}
                        >
                            {isLoading ? "Вход..." : "Войти"}
                        </button>
                        <Link
                            href="/?modal=register"
                            className={`${styles.btnAuth} btn-secondary`}
                            onClick={(e) => {
                                e.preventDefault();
                                onClose();
                                router.push("/?modal=register", undefined, {
                                    shallow: true,
                                });
                            }}
                        >
                            Зарегистрироваться
                        </Link>
                    </form>
                </div>
            </div>
        </>
    );
}
