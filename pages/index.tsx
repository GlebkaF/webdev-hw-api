/* import { useEffect, useState } from "react";
import { api } from "@/services/api"; 
import type { Course } from "@/types/api";
import CourseCard from "@/components/CourseCard/CourseCard";
import styles from "./HomePage.module.css";
import sloganImg from "@/assets/sloganImg.png"; */

import styles from "./indexStyle.module.css";
import Header from "./Header/Header";
import Image from "next/image";


export default function HomePage() {
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

                {/* Рендерим СПИСОК карточек, передавая КАЖДОМУ курс через props */}
                <section className={styles.container__cards}></section>

                <section className={styles.container__btn}>
                    <button
                        className={`${styles.container__btnUp} btn-primary`}
                    >
                        Наверх ↑
                    </button>
                </section>
            </main>
        </div>
    );
}
