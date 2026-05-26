import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Logo from "../Logo/Logo";
import styles from "./StyleModal.module.css";

type RegisterModalProps = {
    onClose: () => void;
};

export default function RegisterModal({ onClose }: RegisterModalProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    // Отслеживает, какое поле невалидно
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

        if (!email.trim()) {
            setFieldErrors((prev) => ({ ...prev, email: true }));
            setError("Введите адрес электронной почты");
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

        try {
            await register(email, password);
            onClose();
        } catch (err: unknown) {
            let message = "Ошибка соединения с сервером";
            if (err instanceof Error) message = err.message;

            if (message.includes("404")) {
                message = "Сервер не найден.";
            } else if (message.includes("400")) {
                message = "Неверные данные. Проверьте почту и пароль.";
            }
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

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <input
                            type="email"
                            placeholder="Эл. почта"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setFieldErrors((prev) => ({
                                    ...prev,
                                    email: false,
                                })); // Сброс ошибки при вводе
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
                                })); // Сброс ошибки при вводе
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
                                })); // Сброс ошибки при вводе
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
