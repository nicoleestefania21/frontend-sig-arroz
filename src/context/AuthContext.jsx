import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedTokens = localStorage.getItem("authTokens");
    const savedUser = localStorage.getItem("authUser");

    if (savedTokens) {
      setTokens(JSON.parse(savedTokens));
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  const login = async ({ username, password }) => {
    try {
      const res = await fetch(`${API_URL}/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          ok: false,
          message: data.detail || "Credenciales inválidas.",
        };
      }

      const authTokens = {
        access: data.access,
        refresh: data.refresh,
      };

      setTokens(authTokens);
      localStorage.setItem("authTokens", JSON.stringify(authTokens));

      const authUser = {
        username,
      };

      setUser(authUser);
      localStorage.setItem("authUser", JSON.stringify(authUser));

      return {
        ok: true,
        user: authUser,
      };
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return {
        ok: false,
        message: "Error de conexión con el servidor.",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem("authTokens");
    localStorage.removeItem("authUser");
  };

  const value = useMemo(
    () => ({
      user,
      tokens,
      login,
      logout,
      loading,
      isAuthenticated: !!tokens?.access,
    }),
    [user, tokens, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}