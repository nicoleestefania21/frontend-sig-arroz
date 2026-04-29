import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Sidebar from "./components/layout/Sidebar";
import HomePage from "./pages/dashboard/HomePage";
import FarmsLotsPage from "./pages/farms/FarmsLotsPage";
import UsersPage from "./pages/users/UsersPage";
import LoginPage from "./pages/auth/LoginPage";
import "./styles/app-layout.css";

// Layout que envuelve la app con el Sidebar
function MainLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div style={{ padding: "50px", textAlign: "center" }}>Cargando SIG-ARROZ...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet /> {/* Aquí se renderiza la página activa */}
      </main>
    </div>
  );
}

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div style={{ padding: "50px", textAlign: "center" }}>Cargando SIG-ARROZ...</div>;

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} />

      {/* Rutas protegidas dentro del MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/fincas-lotes" element={<FarmsLotsPage />} />
        <Route path="/users" element={<UsersPage />} />
      </Route>
    </Routes>
  );
}

export default App;