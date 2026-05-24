import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { useRouter } from "next/router";
import { apiFetch } from "@/libs/apiConfig";

type User = { email: string } | null;

type AuthContextType = {
    user: User;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Проверяем токен при загрузке
    useEffect(() => {
        const savedToken = localStorage.getItem("fitness_token");
        if (savedToken) {
            setToken(savedToken);
            // В демо-режиме считаем, что токен = авторизован
            setUser({ email: "user@skyfitness.pro" });
        }
        setIsLoading(false);
    }, []);

    // Вход (используем apiFetch → удалённый бэкенд)
    const login = async (email: string, password: string) => {
        try {
            // apiFetch сам добавит baseURL, токен и заголовки
            const data = await apiFetch("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            // data уже распарсен, токен в data.token
            localStorage.setItem("fitness_token", data.token);
            setToken(data.token);
            setUser({ email });
            router.push("/");
        } catch (err: any) {
            // apiFetch уже бросил ошибку с сообщением от сервера
            throw new Error(err.message || "Ошибка входа");
        }
    };

    // Регистрация (аналогично)
    const register = async (email: string, password: string) => {
        try {
            const data = await apiFetch("/auth/register", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });
            // После регистрации сразу логиним
            await login(email, password);
        } catch (err: any) {
            throw new Error(err.message || "Ошибка регистрации");
        }
    };

    // Выход
    const logout = () => {
        localStorage.removeItem("fitness_token");
        setToken(null);
        setUser(null);
        router.push("/auth/login");
    };

    return (
        <AuthContext.Provider
            value={{ user, token, login, register, logout, isLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error("useAuth должен использоваться внутри <AuthProvider>");
    return ctx;
}
