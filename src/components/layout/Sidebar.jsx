import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const { user, isAdmin, logout } = useAuth();

  const displayName = user?.first_name || user?.username || "Usuario";
  const roleLabel =
    user?.role === "ADMIN"
      ? "Administrador"
      : user?.role || "Usuario del sistema";

  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-brand-mark">🌾</div>
          <div className="sidebar-brand-text">
            <h2>SIG-ARROZ</h2>
            <p>Panel del sistema</p>
          </div>
        </div>
      </div>

      <div className="sidebar-user-card">
        <div className="sidebar-user-main">
          <div className="sidebar-user-avatar">{userInitial}</div>

          <div className="sidebar-user-meta">
            <p className="sidebar-user-name">{displayName}</p>
            <p className="sidebar-user-role">{roleLabel}</p>
          </div>
        </div>

        <button
          type="button"
          className="sidebar-logout-icon"
          onClick={logout}
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M15 3H10C7.79086 3 6 4.79086 6 7V17C6 19.2091 7.79086 21 10 21H15"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M14 12H21"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M18 9L21 12L18 15"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <nav className="sidebar-menu">
        <ul className="sidebar-nav">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="sidebar-nav-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 10.5L12 3L21 10.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.5 9.5V20H18.5V9.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="sidebar-nav-label">Inicio</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/fincas-lotes"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <span className="sidebar-nav-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 18C6.5 15.5 8.5 15.5 11 18C13.5 20.5 15.5 20.5 18 18C19.2 16.8 20.1 16.2 21 16"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 13C6.5 10.5 8.5 10.5 11 13C13.5 15.5 15.5 15.5 18 13C19.2 11.8 20.1 11.2 21 11"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 8C6.5 5.5 8.5 5.5 11 8C13.5 10.5 15.5 10.5 18 8C19.2 6.8 20.1 6.2 21 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="sidebar-nav-label">Registro de fincas y lotes</span>
            </NavLink>
          </li>

          {isAdmin && (
            <li>
              <NavLink
                to="/users"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="sidebar-nav-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M16 19C16 16.7909 14.2091 15 12 15H8C5.79086 15 4 16.7909 4 19"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="10"
                      cy="8"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M17 11C18.6569 11 20 9.65685 20 8C20 6.34315 18.6569 5 17 5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M20 19C20 17.3431 18.6569 16 17 16"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span className="sidebar-nav-label">Gestión de usuarios</span>
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;