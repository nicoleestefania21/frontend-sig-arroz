import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import HomePage from "./pages/dashboard/HomePage";
import FarmsLotsPage from "./pages/farms/FarmsLotsPage";
import UsersPage from "./pages/users/UsersPage";
import "./styles/app-layout.css";

function App() {
    return (
        <BrowserRouter>
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
        </BrowserRouter>
    );
}

export default App;