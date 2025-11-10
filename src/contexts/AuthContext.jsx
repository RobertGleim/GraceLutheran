import React, { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "../utils/api";

const AuthContext = createContext();

export { AuthContext };

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;

}

export const AuthProvider = ({ children }) => {
    const storedUser = localStorage.getItem("user");
    const [user, setUser] = useState(storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/users/login`, {
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
                    const errBody = await response.json().catch(()=>null);
                    return { success: false, error: errBody?.message || "Server error occurred" };
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
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, error: "Network error occurred" };
        }
    }

    const register = async ({ username, email, password }) => {
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });
            const data = await response.json().catch(()=>null);
            if (!response.ok) {
                return { success: false, error: data?.message || "Registration failed", details: data?.errors };
            }
            // backend returns token + user
            if (data.token && data.user) {
                setUser(data.user);
                setToken(data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("token", data.token);
                return { success: true, user: data.user };
            }
            return { success: false, error: "Invalid server response" };
        } catch (err) {
            console.error("Register error:", err);
            return { success: false, error: "Network error occurred" };
        }
    }

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }

    // helper to decode token payload (safe best-effort)
    const decodeToken = (t) => {
        try {
            const payload = t.split('.')[1];
            const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
            return json;
        } catch {
            return null;
        }
    }

    // if token exists but user not loaded, try to fetch current user from backend
    useEffect(() => {
        let mounted = true;
        const loadUser = async () => {
            if (!token || user) return;
            const decoded = decodeToken(token);
            const userId = decoded?.sub;
            if (!userId) return;
            try {
                const res = await fetch(`${API_URL}/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!mounted) return;
                if (res.ok) {
                    const body = await res.json();
                    setUser(body);
                    localStorage.setItem("user", JSON.stringify(body));
                } else {
                    // token might be invalid/expired: clear it
                    logout();
                }
            } catch (err) {
                console.warn('Could not fetch current user', err);
            }
        };
        loadUser();
        return () => { mounted = false; }
    }, [token]); // eslint-disable-line

    const value = {
        user,
        token,
        login,
        register,
        logout,
    };
    return <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>;
};
