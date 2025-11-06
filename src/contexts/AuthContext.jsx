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
            console.log('Attempting login to:', API_URL + "/users/login");
            console.log('Login credentials:', { email: email, password: password ? '[REDACTED]' : 'empty' });
            
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

            console.log('Response status:', response.status);
            console.log('Response headers:', [...response.headers.entries()]);

            if (!response.ok) {
                let errorText = '';
                try {
                    errorText = await response.text();
                    console.log('Error response body:', errorText);
                } catch {
                    console.log('Could not read error response');
                }
                
                if (response.status === 401) {
                    console.log("Login failed: Invalid credentials");
                    return { success: false, error: "Invalid email or password" };
                } else {
                    console.log("Login failed with status:", response.status, errorText);
                    return { success: false, error: `Server error: ${response.status}` };
                }
            } 

            const data = await response.json();
            console.log('Login successful, response data:', data);
            
            if (data.token && data.user) {
                setUser(data.user);
                setToken(data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("token", data.token);
                return { success: true, user: data.user };
            } else {
                console.log('Invalid response format:', data);
                return { success: false, error: "Invalid server response" };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: "Network error: " + error.message };
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
