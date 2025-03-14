import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import User from "../utils/user/User";
import { useAxios } from "./useAxios";
import { AxiosResponseState } from "../utils/AxiosResponse";
import { useNotifications } from "@toolpad/core/useNotifications";

interface AuthenticationResponse {
    token: string;
}

interface RegisterRequest {
    username: string;
    password: string;
    email: string;
}

interface LoginRequest {
    username: string;
    password: string;
}

interface LoginResponse {
    token: string;
    user: User;
}

interface RegisterResponse {
    token: string;
}

interface AuthContextType {
    login: (loginRequest: LoginRequest) => Promise<LoginResponse>;
    register: (registerRequest: RegisterRequest) => Promise<AuthenticationResponse>;
    logout: () => void;
    connectedUser: User | null;
    setConnectedUser: (user: User | null) => void;
    loading: boolean;
    response: AxiosResponseState<AuthenticationResponse | LoginResponse | null> | null;
    error: any;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const { fetch, loadingAxios, responseAxios, errorAxios } = useAxios<AxiosResponseState<AuthenticationResponse | LoginResponse | null>>();
    const notifications = useNotifications();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (token && storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }else{
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setCurrentUser(null);
        }
    }, []);

    const login = async (loginRequest: LoginRequest): Promise<LoginResponse> => {
        return fetch("api/auth/authenticate", "POST", loginRequest, [
            { status: 404, message: "Error user not found" },
            { status: -1, message: "Error while login" },
            { status: 401, message: "Error wrong password or username" }
        ]).then((response) => {
            const responseData = response?.data?.data;
            if (responseData && "user" in responseData) {
                localStorage.setItem("token", responseData.token);
                localStorage.setItem("user", JSON.stringify(responseData.user));
                setCurrentUser(responseData.user);
                window.location.href = "/";
                return responseData as LoginResponse;
            }
            throw new Error("Invalid response");
        });
    };

    const register = async (registerRequest: RegisterRequest): Promise<AuthenticationResponse> => {
        return fetch("api/auth/register", "POST", registerRequest, [
            { status: 404, message: "Error user not found" },
            { status: -1, message: "Error while registering" },
            { status: 409, message: "Error user already exists" }
        ]).then((response) => {
            notifications.show("User registered successfully.", { severity: "success", autoHideDuration: 3000 });
            if (response?.data?.data) {
                return response.data.data;
            }
            throw new Error("Invalid response");
        });
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ login, register, connectedUser: currentUser, setConnectedUser: setCurrentUser, loading: loadingAxios, response: responseAxios, error: errorAxios, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
