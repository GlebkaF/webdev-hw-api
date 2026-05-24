import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "@/libs/apiConfig";
import { MOCK_COURSES } from "@/libs/mockCourses";
import type { Course } from "@/types/course";
import styles from "./CoursePage.module.css";
import Image from "next/image";
import Link from "next/link";

export default function CoursePage() {
    const router = useRouter();
    const { id } = router.query;
    const { user } = useAuth();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdded, setIsAdded] = useState(false);

    useEffect(() => {
        if (!id) return;

        // Гарантируем, что id — строка
        const courseId = Array.isArray(id) ? id[0] : id;

        const fetchCourse = async () => {
            try {
                const data = await apiFetch(`/courses/${courseId}`);
                setCourse(data as Course);
            } catch {
                const mock = MOCK_COURSES.find(
                    (c) => c._id === courseId || c.id === courseId,
                );
                if (mock) setCourse(mock as Course);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    const hasPurchased = false;

    const handleAddCourse = async () => {
        if (!user) {
            router.push(`/login?redirect=/courses/${id}`);
            return;
        }
        try {
            await apiFetch(`/user/courses/${id}`, { method: "POST" });
            setIsAdded(true);
        } catch (err) {
            console.error("Ошибка добавления курса:", err);
        }
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <Header />
                <p>Загрузка курса...</p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className={styles.notFound}>
                <Header />
                <p>Курс не найден 😔</p>
                <Link href="/" className={styles.backLink}>
                    ← На главную
                </Link>
            </div>
        );
    }

    const title = course.nameRU || course.title || course.name || "Курс";
    const bgImage = course.imageBG || course.image || "/img/1-yoga-l.png";

    return (
        <div className={styles.page}>
            <Header />

            {/* Шапка курса */}
            <section className={styles.header}>
                <div className={styles.header__content}>
                    <h1 className={styles.header__title}>{title}</h1>
                    <p className={styles.header__description}>
                        {course.description || "Описание курса будет здесь"}
                    </p>
                    <div className={styles.header__meta}>
                        <span>⏱ {course.durationInDays || 25} дней</span>
                        <span>
                            🕐 {course.dailyDurationInMinutes?.from || 20}-
                            {course.dailyDurationInMinutes?.to || 50} мин/день
                        </span>
                    </div>
                </div>
                <div className={styles.header__image}>
                    <Image
                        src={bgImage}
                        alt={title}
                        fill
                        style={{ objectFit: "cover", borderRadius: "16px" }}
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>
            </section>

            {/* Блок "Подойдет для вас, если" */}
            <section className={styles.section}>
                <h2 className={styles.section__title}>
                    Подойдет для вас, если:
                </h2>
                <div className={styles.conditions}>
                    <div className={styles.condition}>
                        <span className={styles.condition__number}>1</span>
                        <p>Давно хотели попробовать, но не решались начать</p>
                    </div>
                    <div className={styles.condition}>
                        <span className={styles.condition__number}>2</span>
                        <p>Хотите укрепить тело и улучшить самочувствие</p>
                    </div>
                    <div className={styles.condition}>
                        <span className={styles.condition__number}>3</span>
                        <p>Ищете активность для тела и души</p>
                    </div>
                </div>
            </section>

            {/* Направления */}
            {course.directions?.length && (
                <section className={styles.section}>
                    <h2 className={styles.section__title}>Направления</h2>
                    <div className={styles.directions}>
                        {course.directions.map((dir, i) => (
                            <div key={i} className={styles.direction}>
                                ✦ {dir}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* CTA-блок с бегуном */}
            <section className={styles.cta}>
                <div className={styles.cta__content}>
                    <h2 className={styles.cta__title}>
                        Начните путь к новому телу
                    </h2>
                    <ul className={styles.benefits}>
                        {(
                            course.benefits || [
                                "проработка всех групп мышц",
                                "тренировка суставов",
                                "улучшение циркуляции крови",
                                "упражнения заряжают бодростью",
                                "помогают противостоять стрессам",
                            ]
                        ).map((benefit, i) => (
                            <li key={i}>{benefit}</li>
                        ))}
                    </ul>

                    {!user ? (
                        <button
                            onClick={handleAddCourse}
                            className={`${styles.btn} ${styles.btn__login}`}
                        >
                            Войдите, чтобы добавить курс
                        </button>
                    ) : hasPurchased || isAdded ? (
                        <button
                            disabled
                            className={`${styles.btn} ${styles.btn__added}`}
                        >
                            Курс уже добавлен ✓
                        </button>
                    ) : (
                        <button
                            onClick={handleAddCourse}
                            className={`${styles.btn} ${styles.btn__primary}`}
                        >
                            Добавить курс
                        </button>
                    )}
                </div>
                <div className={styles.cta__image}>
                    <Image
                        src="/img/runner.png"
                        alt="Бегун"
                        width={350}
                        height={400}
                        priority
                    />
                </div>
            </section>
        </div>
    );
}
