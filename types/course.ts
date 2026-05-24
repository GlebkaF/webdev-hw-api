export interface DailyDuration {
    from?: number;
    to?: number;
}

export interface Course {
    _id: string;
    id?: string;
    nameRU?: string;
    nameEN?: string;
    title?: string;
    name?: string;
    imageBG?: string;
    image?: string;
    durationInDays?: number;
    dailyDurationInMinutes?: DailyDuration;
    description?: string;
    directions?: string[];
    fitting?: string[];
    workouts?: string[];
    benefits?: string[];
    requirements?: string[];
    instructor?: string;
    level?: "beginner" | "intermediate" | "advanced";
}

export interface MockCourses extends Course {
    instructor?: string;
    level?: "beginner" | "intermediate" | "advanced";
}

export interface Workout {
    _id: string;
    title: string;
    day: number;
    duration: number;
    completed?: boolean;
}

export interface UserProgress {
    courseId: string;
    completedWorkouts: string[];
    lastAccessed?: string;
}
