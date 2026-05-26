import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Logo from "../Logo/Logo";
import styles from "./StyleModal.module.css";

type LoginModalProps = {
    onClose: () => void;
};

export default function LoginModal({ onClose }: LoginModalProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Отслеживает, какое поле невалидно
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

        try {
            await login(email, password);
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
                            placeholder="Логин"
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
