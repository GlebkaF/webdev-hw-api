export interface User {
    _id: string;
    email: string;
    name?: string;
    avatar?: string;
    purchasedCourses?: string[];
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}
