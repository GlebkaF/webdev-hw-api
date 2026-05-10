import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { useRouter } from "next/router";

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

    //  Проверяем токен при каждой загрузке страницы
    useEffect(() => {
        const savedToken = localStorage.getItem("fitness_token");
        if (savedToken) {
            setToken(savedToken);
            // Для демо считаем, что если токен есть → пользователь вошёл
            // В продакшене тут можно декодировать JWT или сделать запрос /users/me
            setUser({ email: "user@skyfitness.pro" });
        }
        setIsLoading(false);
    }, []);

    // 🔹 Вход
    const login = async (email: string, password: string) => {
        const res = await fetch("/api/fitness/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Ошибка входа");

        localStorage.setItem("fitness_token", data.token);
        setToken(data.token);
        setUser({ email });
        router.push("/"); // Перенаправляем на главную
    };

    // 🔹 Регистрация
    const register = async (email: string, password: string) => {
        const res = await fetch("/api/fitness/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Ошибка регистрации");
        // После регистрации обычно просим войти, или сразу логиним:
        await login(email, password);
    };

    // 🔹 Выход
    const logout = () => {
        localStorage.removeItem("fitness_token");
        setToken(null);
        setUser(null);
        router.push("/login");
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
