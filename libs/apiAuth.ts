import axios from "axios";

const AUTH_BASE_URL = "https://wedev-api.sky.pro/api";

const authApi = axios.create({
    baseURL: AUTH_BASE_URL,
    headers: {
        "Content-Type": "",
    },
});

authApi.interceptors.request.use((config) => {
    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("fitness_token")
            : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export type AuthUser = {
    _id: string;
    login: string;
    name: string;
    token: string;
    imageUrl?: string;
    createdAt?: string;
    updatedAt?: string;
};

export type LoginCredentials = {
    login: string;
    password: string;
};

export type RegisterCredentials = LoginCredentials & {
    name: string;
};

export const login = async (
    credentials: LoginCredentials,
): Promise<AuthUser> => {
    const response = await authApi.post<{ user: AuthUser }>(
        "/user/login",
        credentials,
    );
    return response.data.user;
};

export const register = async (
    credentials: RegisterCredentials,
): Promise<AuthUser> => {
    const response = await authApi.post<{ user: AuthUser }>(
        "/user",
        credentials,
    );
    return response.data.user;
};
