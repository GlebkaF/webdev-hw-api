import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Logo from "../../components/Logo/Logo";
import styles from "./authPage.module.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login, isLoading } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await login(email, password);
            router.push("/");
        } catch (err: unknown) {
            let message = "Ошибка соединения с сервером";
            if (err instanceof Error) message = err.message;
            if (message.includes("404")) {
                message = "Сервер не найден. Убедитесь, что бэкенд запущен.";
            } else if (message.includes("400")) {
                message = "Неверные данные. Проверьте почту и пароль.";
            }
            setError(message);
        }
    };

    return (
        <>
            <div
                className={styles.backdrop}
                onClick={(e) => {
                    e.stopPropagation();
                    router.push("/");
                }}
            />

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
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            required
                        />
                        {error && <div className={styles.error}>{error}</div>}
                        <button
                            type="submit"
                            className={`${styles.btn} ${styles.btnPrimary}`}
                            disabled={isLoading}
                        >
                            {isLoading ? "Вход..." : "Войти"}
                        </button>
                        <Link
                            href="/auth/register"
                            className={`${styles.btn} ${styles.btnSecondary}`}
                        >
                            Зарегистрироваться
                        </Link>
                    </form>
                </div>
            </div>
        </>
    );
}
