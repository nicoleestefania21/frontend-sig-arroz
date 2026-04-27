import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const API_URL = import.meta.env.VITE_API_URL;

// Usuarios locales para desarrollo — solo activos cuando VITE_USE_MOCK=true
const mockUsers = [
  {
    id: 1,
    nombre: "Nicole Angarita",
    username: "admin",
    correo: "admin@sigarroz.com",
    password: "123456",
    rol: "Administrador",
  },
  {
    id: 2,
    nombre: "Carlos Gómez",
    username: "tecnico",
    correo: "tecnico@sigarroz.com",
    password: "123456",
    rol: "Técnico",
  },
  {
    id: 3,
    nombre: "Ana Pérez",
    username: "productor",
    correo: "productor@sigarroz.com",
    password: "123456",
    rol: "Productor",
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!USE_MOCK) {
      const savedTokens = localStorage.getItem("authTokens");
      const savedUser = localStorage.getItem("authUser");
      if (savedTokens) setTokens(JSON.parse(savedTokens));
      if (savedUser) setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async ({ username, password }) => {
    // ── Modo local (sin backend) ─────────────────────────
    if (USE_MOCK) {
      const found = mockUsers.find(
        (u) =>
          (u.username === username || u.correo === username) &&
          u.password === password
      );
      if (!found) {
        return { ok: false, message: "Credenciales inválidas." };
      }
      setUser(found);
      return { ok: true, user: found };
    }

    // ── Modo real (Django JWT) ───────────────────────────
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
          message: data.detail || "Credenciales inválidas.",
        };
      }

      const authTokens = { access: data.access, refresh: data.refresh };
      const authUser = { username };

      setTokens(authTokens);
      setUser(authUser);
      localStorage.setItem("authTokens", JSON.stringify(authTokens));
      localStorage.setItem("authUser", JSON.stringify(authUser));

      return { ok: true, user: authUser };
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return { ok: false, message: "Error de conexión con el servidor." };
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
      isAuthenticated: USE_MOCK ? !!user : !!tokens?.access,
    }),
    [user, tokens, loading]
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