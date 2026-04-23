import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  {
    label: "Principal",
    items: [
      {
        to: "/inicio",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </svg>
        ),
        label: "Inicio",
      },
      {
        to: "/fincas-lotes",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        ),
        label: "Fincas y lotes",
      },
    ],
  },
  {
    label: "Administración",
    items: [
      {
        to: "/usuarios",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87" />
            <path d="M16 3.13a4 4 0 010 7.75" />
          </svg>
        ),
        label: "Usuarios",
      },
    ],
  },
];

function getInitials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar">
      {/* Marca */}
      <div className="sidebar__brand">
        <div className="sidebar__brand-logo" aria-hidden="true">🌾</div>
        <div className="sidebar__brand-text">
          <h2>SIGARROZ</h2>
          <p>Sistema de gestión</p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="sidebar__nav" aria-label="Navegación principal">
        {NAV_ITEMS.map((group) => (
          <div key={group.label}>
            <span className="sidebar__section-label">{group.label}</span>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `sidebar__item${isActive ? " sidebar__item--active" : ""}`
                }
              >
                <span className="sidebar__item-icon" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer con usuario */}
      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__avatar" aria-hidden="true">
            {user ? getInitials(user.username) : "?"}
          </div>
          <div className="sidebar__user-info">
            <strong>{user?.username || "Usuario"}</strong>
            <span>Sesión activa</span>
          </div>
          <button
            className="sidebar__logout"
            onClick={handleLogout}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;