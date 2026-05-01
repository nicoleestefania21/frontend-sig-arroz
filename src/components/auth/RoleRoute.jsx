import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function RoleRoute({ children, allow = [] }) {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
        return <div style={{ padding: "50px", textAlign: "center" }}>Cargando SIG-ARROZ...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const userRole = user?.role;
    const isAllowed = allow.length === 0 || allow.includes(userRole);

    if (!isAllowed) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default RoleRoute;