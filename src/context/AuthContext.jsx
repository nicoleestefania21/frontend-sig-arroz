import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext();

const mockUsers = [
  {
    id: 1,
    nombre: "Nicole Angarita",
    correo: "admin@sigarroz.com",
    password: "123456",
    rol: "Administrador",
  },
  {
    id: 2,
    nombre: "Carlos Gómez",
    correo: "tecnico@sigarroz.com",
    password: "123456",
    rol: "Técnico",
  },
  {
    id: 3,
    nombre: "Ana Pérez",
    correo: "productor@sigarroz.com",
    password: "123456",
    rol: "Productor",
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = ({ correo, password }) => {
    const foundUser = mockUsers.find(
      (u) => u.correo === correo && u.password === password
    );

    if (!foundUser) {
      return {
        ok: false,
        message: "Credenciales inválidas. Verifica tu correo y contraseña.",
      };
    }

    setUser(foundUser);

    return {
      ok: true,
      user: foundUser,
    };
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: !!user,
    }),
    [user]
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