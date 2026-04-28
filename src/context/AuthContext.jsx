import { createContext, useContext, useMemo, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/users";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Al montar: restaurar sesión desde localStorage ──
  useEffect(() => {
    const access = localStorage.getItem("access_token");
    if (!access) {
      setLoading(false);
      return;
    }
    const payload = parseJwt(access);
    if (payload && payload.exp * 1000 > Date.now()) {
      fetchMe(access);
    } else {
      refreshAccessToken().finally(() => setLoading(false));
    }
  }, []);

  async function fetchMe(access) {
    try {
      const res = await fetch(`${API_URL}/me/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        clearSession();
      }
    } catch {
      clearSession();
    } finally {
      setLoading(false);
    }
  }

  async function refreshAccessToken() {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) return null;
    try {
      const res = await fetch(`${API_URL}/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("access_token", data.access);
        await fetchMe(data.access);
        return data.access;
      } else {
        clearSession();
        return null;
      }
    } catch {
      clearSession();
      return null;
    }
  }

  function clearSession() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  }

  const login = async ({ username, password }) => {
    try {
      const res = await fetch(`${API_URL}/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return {
          ok: false,
          message: data.detail || "Credenciales inválidas. Verifica tu usuario y contraseña.",
        };
      }
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      await fetchMe(data.access);
      return { ok: true };
    } catch {
      return { ok: false, message: "No se pudo conectar con el servidor. Intenta de nuevo." };
    }
  };

  const logout = useCallback(() => {
    clearSession();
  }, []);

  // Helper para cualquier fetch autenticado desde otros componentes
  const authFetch = useCallback(async (url, options = {}) => {
    let access = localStorage.getItem("access_token");
    const payload = parseJwt(access);
    if (payload && payload.exp * 1000 - Date.now() < 60_000) {
      access = await refreshAccessToken();
    }
    return fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
        ...(options.headers || {}),
      },
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      loading,
      authFetch,
      isAuthenticated: !!user,
      isAdmin: user?.role === "ADMIN",
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}