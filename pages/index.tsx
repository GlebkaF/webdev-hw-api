import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header/Header";
import CourseCard from "../components/CourseCard/CourseCard";
import type { Course } from "@/types/course";
import styles from "./indexStyle.module.css";
import Image from "next/image";
import { apiFetch } from "@/libs/apiConfig";
import { MOCK_COURSES } from "@/libs/mockCourses";
import LoginModal from "../components/Auth/LoginModal";
import RegisterModal from "../components/Auth/RegisterModal";

export default function HomePage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    // Состояние для модальных окон
    const [activeModal, setActiveModal] = useState<"login" | "register" | null>(
        null,
    );
    const router = useRouter();

    // Следим за изменением параметров в адресной строке
    useEffect(() => {
        const { modal } = router.query;
        if (modal === "login") setActiveModal("login");
        else if (modal === "register") setActiveModal("register");
        else setActiveModal(null);
    }, [router.query]);

    // Функция закрытия модального окна
    const closeModal = () => {
        router.push("/", undefined, { shallow: true });
        setActiveModal(null);
    };

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

            {/* Рендерим модальные окна ПОВЕРХ главной страницы */}
            {activeModal === "login" && (
                <div className={styles.modalWrapper}>
                    <LoginModal onClose={closeModal} />
                </div>
            )}
            {activeModal === "register" && (
                <div className={styles.modalWrapper}>
                    <RegisterModal onClose={closeModal} />
                </div>
            )}
        </div>
    );
}
