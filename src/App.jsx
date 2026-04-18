import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import HomePage from "./pages/dashboard/HomePage";
import FarmsLotsPage from "./pages/farms/FarmsLotsPage";
import UsersPage from "./pages/users/UsersPage";
import LoginPage from "./pages/auth/LoginPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./styles/app-layout.css";

function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/fincas-lotes" replace />} />
          <Route path="/inicio" element={<HomePage />} />
          <Route path="/fincas-lotes" element={<FarmsLotsPage />} />
          <Route path="/usuarios" element={<UsersPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;