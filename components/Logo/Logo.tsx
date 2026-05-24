import styles from "./Logo.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Logo() {
    return (
        <div className={styles.wrapperLogo}>
            <Link href="/" className={styles.linkLogo} aria-label="На главную">
                <Image
                    className={styles.linkLogo__img}
                    src="/img/Logo.png"
                    alt="Логотип SkyFitnessPro"
                    width={29}
                    height={20}
                    priority
                />

                <span className={styles.linkLogo__title}>SkyFitnessPro</span>
            </Link>
        </div>
    );
}
