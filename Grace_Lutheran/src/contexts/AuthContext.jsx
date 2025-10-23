// eslint-disable-next-line no-unused-vars
import React, { createContext, useContext, useState, useEffect } from "react";


const AuthContext = createContext();


// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
        const context = useContext(AuthContext);
        return context;

}

const API_URL = "http://127.0.0.1:5000";

export const AuthProvider = ({ children }) => {
    const storedUser = localStorage.getItem("user");
    const [user, setUser] = useState(storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const login = async (email, password) => {
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
            console.log("Login failed");
            return;
        } 

        const data = await response.json();
        console.log('response data', data);
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
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
