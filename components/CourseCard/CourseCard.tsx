import Link from "next/link";
import Image from "next/image";
import type { Course } from "@/types/course";
import styles from "./CourseCard.module.css";

interface CourseCardProps {
    course: Course;
}

// СЛОВАРЬ: название курса → путь к картинке
const COURSE_IMAGES: Record<string, string> = {
    Йога: "/img/1-yoga-l.png",
    Стретчинг: "/img/2-stretching-l.png",
    Фитнес: "/img/3-fitness-l.png",
    "Степ-аэробика": "/img/4-aerobics-l.png",
    Бодифлекс: "/img/5-bodyflex-l.png",
    Yoga: "/img/1-yoga-l.png",
    Stretching: "/img/2-stretching-l.png",
    Fitness: "/img/3-fitness-l.png",
    Aerobics: "/img/4-aerobics-l.png",
    Bodyflex: "/img/5-bodyflex-l.png",
};

export default function CourseCard({ course }: CourseCardProps) {
    const title = course.nameRU || course.title || course.name || "Курс";

    const bgImage =
        course.imageBG ||
        course.image ||
        COURSE_IMAGES[title] ||
        COURSE_IMAGES[title.split(" ")[0]] ||
        "/img/1-yoga-l.png";

    return (
        <article className={styles.cards__course}>
            <div className={styles.cards__bg}>
                <Image
                    src={bgImage}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                    priority
                />
                <button
                    className={styles.cards__btnAddCourse}
                    aria-label="Добавить курс"
                >
                    <Image
                        src="/img/btnAddIcon.png"
                        alt="add"
                        width={27}
                        height={27}
                        priority
                    />
                </button>
            </div>

            <div className={styles.cards__content}>
                <Link
                    href={`/courses/${course._id}`}
                    className={styles.cards__link}
                >
                    <h3 className={styles.cards__name}>{title}</h3>
                </Link>

                <div className={styles.cards__meta}>
                    <span className={styles.cards__item}>
                        <Image
                            src="/img/calendar.svg"
                            alt=""
                            width={16}
                            height={16}
                            aria-hidden="true"
                        />
                        {course.durationInDays || 25} дней
                    </span>
                    <span className={styles.cards__item}>
                        <Image
                            src="/img/time.svg"
                            alt=""
                            width={16}
                            height={16}
                            aria-hidden="true"
                        />
                        {course.dailyDurationInMinutes?.from || 20}-
                        {course.dailyDurationInMinutes?.to || 50} мин/день
                    </span>
                </div>

                <span className={styles.cards__item}>
                    <Image
                        src="/img/signal-fill.svg"
                        alt=""
                        width={16}
                        height={16}
                        aria-hidden="true"
                    />
                    Сложность
                </span>
            </div>
        </article>
    );
}
