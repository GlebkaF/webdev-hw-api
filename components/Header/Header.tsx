import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import styles from "./Header.module.css";
import Logo from "../../components/Logo/Logo";

export default function Header() {
    const { user, logout, isLoading } = useAuth();

    // Стейт для управления меню профиля
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Закрыть меню при клике вне его области
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);

    // Обработчик выхода
    const handleLogout = async () => {
        try {
            await logout();
            setIsMenuOpen(false);
        } catch (err) {
            console.error("Ошибка при выходе:", err);
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.header__container}>
                <Logo />

                <p className={styles.container__text}>
                    Онлайн-тренировки для занятий дома
                </p>
            </div>

            <div className={styles.header__auth}>
                {/* УСЛОВНЫЙ РЕНДЕРИНГ: показываем разные кнопки в зависимости от авторизации */}

                {isLoading ? (
                    // Показываем индикатор загрузки, пока проверяем авторизацию
                    <div className={styles.header__loading}>⏳</div>
                ) : user ? (
                    // Пользователь АВТОРИЗОВАН → показываем меню профиля
                    <div className={styles.header__profileMenu} ref={menuRef}>
                        <button
                            className={styles.header__profileButton}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-expanded={isMenuOpen}
                            aria-label="Меню профиля"
                        >
                            <span className={styles.header__userName}>
                                {user.email?.split("@")[0] || "Профиль"}
                            </span>
                            <svg
                                className={`${styles.header__chevron} ${
                                    isMenuOpen ? styles.header__chevronUp : ""
                                }`}
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M4 6l4 4 4-4"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>

                        {isMenuOpen && (
                            <div className={styles.header__dropdownMenu}>
                                <div className={styles.header__userInfo}>
                                    <div
                                        className={
                                            styles.header__userInfoAvatar
                                        }
                                    >
                                        <svg
                                            width="32"
                                            height="32"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        className={styles.header__userInfoText}
                                    >
                                        <div
                                            className={
                                                styles.header__userInfoName
                                            }
                                        >
                                            Профиль
                                        </div>
                                        <div
                                            className={
                                                styles.header__userInfoEmail
                                            }
                                        >
                                            {user.email}
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href="/profile"
                                    className={`${styles.header__menuButton} ${styles.btnPrimary}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Мой профиль
                                </Link>

                                <button
                                    className={`${styles.header__menuButton} ${styles.btnOutline}`}
                                    onClick={handleLogout}
                                >
                                    Выйти
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    // Пользователь НЕ авторизован → показываем кнопку "Войти"
                    <Link
                        href="/?modal=login"
                        className={`${styles.header__btnLogin} btn-primary`}
                    >
                        Войти
                    </Link>
                )}
            </div>
        </header>
    );
}
