import type { Course } from "@/pages/CourseCard/CourseCard";

interface MockCourse extends Course {
  nameEN?: string;
  description?: string;
  directions?: string[];
  fitting?: string[];
  workouts?: string[];
}

export const MOCK_COURSES: MockCourse[] = [
  {
    _id: "1",
    nameRU: "Йога",
    nameEN: "Yoga Basics",
    description: "Базовый курс для развития гибкости и баланса",
    durationInDays: 25,
    dailyDurationInMinutes: { from: 20, to: 50 },
    directions: ["Гибкость", "Дыхание", "Релакс"],
    fitting: ["Коврик", "Плед"],
    workouts: ["w1", "w2", "w3"],
    imageBG: "/img/1-yoga-l.png",
  },
  {
    _id: "2",
    nameRU: "Стретчинг",
    nameEN: "Full Body Stretch",
    description: "Растяжка мышц и восстановление после нагрузок",
    durationInDays: 25,
    dailyDurationInMinutes: { from: 20, to: 50 },
    directions: ["Восстановление", "Гибкость"],
    fitting: ["Коврик", "Ремень"],
    workouts: ["w4", "w5"],
    imageBG: "/img/2-stretching-l.png",
  },
  {
    _id: "3",
    nameRU: "Фитнес",
    nameEN: "Home Fitness",
    description: "Интенсивные тренировки для укрепления мышц",
    durationInDays: 30,
    dailyDurationInMinutes: { from: 30, to: 60 },
    directions: ["Сила", "Выносливость"],
    fitting: ["Гантели", "Коврик"],
    workouts: ["w6", "w7", "w8"],
    imageBG: "/img/3-fitness-l.png",
  },
  {
    _id: "4",
    nameRU: "Степ-аэробика",
    nameEN: "Step Aerobics",
    description: "Кардио-тренировки с использованием степ-платформы",
    durationInDays: 21,
    dailyDurationInMinutes: { from: 25, to: 45 },
    directions: ["Кардио", "Координация"],
    fitting: ["Степ-платформа"],
    workouts: ["w9", "w10"],
    imageBG: "/img/4-aerobics-l.png",
  },
  {
    _id: "5",
    nameRU: "Бодифлекс",
    nameEN: "Bodyflex",
    description: "Дыхательная гимнастика для похудения и тонуса",
    durationInDays: 25,
    dailyDurationInMinutes: { from: 15, to: 30 },
    directions: ["Дыхание", "Похудение"],
    fitting: ["Коврик"],
    workouts: ["w11", "w12"],
    imageBG: "/img/5-bodyflex-l.png",
  },
];