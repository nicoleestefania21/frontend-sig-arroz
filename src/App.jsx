import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Sidebar from "./components/layout/Sidebar";
import HomePage from "./pages/dashboard/HomePage";
import FarmsLotsPage from "./pages/farms/FarmsLotsPage";
import UsersPage from "./pages/users/UsersPage";
import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ResetPasswordSuccessPage from "./pages/auth/ResetPasswordSuccessPage";
import SowingPage from "./pages/sowing/SowingPage";
import TerrainWorksPage from "./pages/terrain/TerrainWorksPage";
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
      <Route path="/recuperar-contrasena" element={<ForgotPasswordPage />} />
      <Route path="/recuperar-contrasena/exito" element={<ResetPasswordSuccessPage />} />
      <Route path="/restablecer-contrasena/:uidb64/:token" element={<ResetPasswordPage />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/fincas-lotes" element={<FarmsLotsPage />} />
        <Route path="/labores-terreno" element={<TerrainWorksPage />} />
        <Route path="/sowing" element={<SowingPage />} />
        <Route path="/users" element={<UsersPage />} />
      </Route>
    </Routes>
  );
}

export default App;