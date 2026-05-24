import { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import CourseCard from "../components/CourseCard/CourseCard";
import type { Course } from "@/types/course";
import styles from "./indexStyle.module.css";
import Image from "next/image";
import { apiFetch } from "@/libs/apiConfig";
import { MOCK_COURSES } from "@/libs/mockCourses";

export default function HomePage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await apiFetch("/courses");
                setCourses(Array.isArray(data) ? data : []);
            } catch (err) {
                setCourses(MOCK_COURSES as Course[]);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <div className={styles.homePage}>
            <Header />
            <main className={styles.homePage__container}>
                <section className={styles.container__text}>
                    <h1 className={styles.text__title}>
                        Начните заниматься спортом и улучшите качество жизни
                    </h1>
                    <div className={styles.text__sloganWrapper}>
                        <div className={styles.text__slogan}>
                            <p className={styles.text__sloganTitle}>
                                Измени своё тело за полгода!
                            </p>
                        </div>
                        <Image
                            className={styles.text__sloganImg}
                            src="/img/sloganImg.png"
                            width={30}
                            height={35}
                            alt="SkyFitnessPro"
                            priority
                        />
                    </div>
                </section>

                <section className={styles.container__cards}>
                    {loading ? (
                        <p className={styles.loadingText}>Загрузка курсов...</p>
                    ) : courses.length > 0 ? (
                        courses.map((course) => (
                            <CourseCard
                                key={course._id || course.id}
                                course={course}
                            />
                        ))
                    ) : (
                        <p className={styles.emptyText}>Курсов пока нет 😔</p>
                    )}
                </section>

                <section className={styles.container__btn}>
                    <button
                        className={`${styles.container__btnUp} btn-primary`}
                        onClick={scrollToTop}
                    >
                        Наверх ↑
                    </button>
                </section>
            </main>
        </div>
    );
}
