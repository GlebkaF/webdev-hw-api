import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { useRouter } from "next/router";
import {
    login as authLogin,
    register as authRegister,
    type AuthUser,
} from "@/libs/apiAuth";

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
            // 👇 Передаём email как login, потому что внешний API так ожидает
            const user: AuthUser = await authLogin({ login: email, password });

            if (user.token) {
                localStorage.setItem("fitness_token", user.token);
                setToken(user.token);
            }

            // Маппим: login из API → email в нашем стейте
            setUser({ email: user.login });
            router.push("/");
        } catch (err: any) {
            throw new Error(err.message || "Ошибка входа");
        }
    };

    const register = async (email: string, password: string) => {
        try {
            const user: AuthUser = await authRegister({
                login: email,
                password,
                name: email.split("@")[0], // генерируем имя из почты
            });

            if (user.token) {
                localStorage.setItem("fitness_token", user.token);
                setToken(user.token);
            }

            setUser({ email: user.login });
            router.push("/");
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
