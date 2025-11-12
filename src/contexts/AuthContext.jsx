import React, { createContext, useContext, useState, useEffect } from "react";
import { API_URL, apiFetch } from "../utils/api";

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

    // Sync user role from token on mount if token exists
    useEffect(() => {
        if (token && user) {
            const decoded = decodeToken(token);
            if (decoded?.role && decoded.role !== user.role) {
                const updatedUser = { ...user, role: decoded.role };
                setUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
            }
        }
    }, []); // eslint-disable-line

    const login = async (email, password) => {
        try {
            const response = await apiFetch('/users/login', {
                method: "POST",
                body: { email, password }
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
                // Ensure role from token is used
                const decoded = decodeToken(data.token);
                const userWithRole = { ...data.user, role: decoded?.role || data.user.role || 'user' };
                
                setUser(userWithRole);
                setToken(data.token);
                localStorage.setItem("user", JSON.stringify(userWithRole));
                localStorage.setItem("token", data.token);
                return { success: true, user: userWithRole };
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
            const response = await apiFetch('/users', {
                method: "POST",
                body: { username, email, password }
            });
            const data = await response.json().catch(()=>null);
            if (!response.ok) {
                return { success: false, error: data?.message || "Registration failed", details: data?.errors };
            }
            // backend returns token + user
            if (data.token && data.user) {
                const decoded = decodeToken(data.token);
                const userWithRole = { ...data.user, role: decoded?.role || data.user.role || 'user' };
                
                setUser(userWithRole);
                setToken(data.token);
                localStorage.setItem("user", JSON.stringify(userWithRole));
                localStorage.setItem("token", data.token);
                return { success: true, user: userWithRole };
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

    // Refresh user data from backend (call after role changes)
    const refreshUser = async () => {
        if (!token) return { success: false, error: "No token available" };
        
        const decoded = decodeToken(token);
        const userId = decoded?.sub;
        if (!userId) return { success: false, error: "Invalid token" };
        
        try {
            const res = await apiFetch(`/users/${userId}`, {
                method: 'GET'
            });
            
            if (res.ok) {
                const userData = await res.json();
                // Always use role from current token
                const userWithTokenRole = { ...userData, role: decoded.role || userData.role || 'user' };
                
                setUser(userWithTokenRole);
                localStorage.setItem("user", JSON.stringify(userWithTokenRole));
                return { success: true, user: userWithTokenRole };
            } else {
                return { success: false, error: "Failed to fetch user data" };
            }
        } catch (err) {
            console.error('Error refreshing user:', err);
            return { success: false, error: "Network error" };
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
                const res = await apiFetch(`/users/${userId}`, {
                    method: 'GET'
                });
                if (!mounted) return;
                if (res.ok) {
                    const body = await res.json();
                    // Use role from token, not just from API response
                    const userWithTokenRole = { ...body, role: decoded.role || body.role || 'user' };
                    setUser(userWithTokenRole);
                    localStorage.setItem("user", JSON.stringify(userWithTokenRole));
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
        refreshUser, // Add this for manual refresh after role changes
    };
    return <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>;
};
