// eslint-disable-next-line no-unused-vars
import React, { createContext, useContext, useState, useEffect } from "react";


const AuthContext = createContext();

export { AuthContext };

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
        const context = useContext(AuthContext);
        return context;

}

const API_URL = import.meta.env.VITE_API_URL || "https://gracelutheranbacke.onrender.com";

export const AuthProvider = ({ children }) => {
    const storedUser = localStorage.getItem("user");
    const [user, setUser] = useState(storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const login = async (email, password) => {
        try {
            const response = await fetch(API_URL + "/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    email: email, 
                    password: password
                }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    return { success: false, error: "Invalid email or password" };
                } else {
                    return { success: false, error: "Server error occurred" };
                }
            } 

            const data = await response.json();
            
            if (data.token && data.user) {
                setUser(data.user);
                setToken(data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("token", data.token);
                return { success: true, user: data.user };
            } else {
                return { success: false, error: "Invalid server response" };
            }
        } catch {
            return { success: false, error: "Network error occurred" };
        }
    }

    const value = {
        user,
        token,
        login,
    };
    return <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>;
};
