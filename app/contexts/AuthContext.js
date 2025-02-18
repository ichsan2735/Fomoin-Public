import { createContext, useState } from "react";

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [isLogin, setIsLogin] = useState(false)

    return (
        <AuthContext.Provider value={{ isLogin, setIsLogin }}>
            {children}
        </AuthContext.Provider>
    )
}