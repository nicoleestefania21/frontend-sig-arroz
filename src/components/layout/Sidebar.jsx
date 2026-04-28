import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Los roles ahora usan los valores reales del backend Django
const navItems = [
  {
    to: "/inicio",
    label: "Inicio",
    roles: ["ADMIN", "TECNICO", "PRODUCTOR", "OPERADOR"],
  },
  {
    to: "/fincas-lotes",
    label: "Registro de fincas y lotes",
    roles: ["ADMIN", "TECNICO", "PRODUCTOR", "OPERADOR"],
  },
  {
    to: "/usuarios",
    label: "Gestión de usuarios",
    roles: ["ADMIN"],
  },
];

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

// Por esta:
const itemsVisibles = navItems.filter((item) =>
  item.roles.includes(user?.role) ||
  (user?.is_superuser && item.roles.includes("ADMIN"))
);

  // Nombre para mostrar: primero first_name, si no username
  const displayName =
    user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : user?.first_name || user?.username || "Usuario";

  // Inicial para el avatar
  const avatarLetter = (user?.first_name || user?.username || "U")
    .charAt(0)
    .toUpperCase();

  // Rol legible en español
  const roleLabels = {
    ADMIN: "Administrador",
    TECNICO: "Técnico Agrícola",
    PRODUCTOR: "Productor Arrocero",
    OPERADOR: "Operador de Campo",
  };
  const displayRole = roleLabels[user?.role] || user?.role || "";

  return (
    <aside className="global-sidebar">
      <div className="global-sidebar__brand">
        <h2>SIG-ARROZ</h2>
        <p>Panel del sistema</p>
      </div>

      <nav className="global-sidebar__nav">
        {itemsVisibles.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive
                ? "global-sidebar__item global-sidebar__item--active"
                : "global-sidebar__item"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="global-sidebar__footer">
        <div className="global-sidebar__user">
          <div className="global-sidebar__user-avatar">
            {avatarLetter}
          </div>
          <div className="global-sidebar__user-info">
            <span className="global-sidebar__user-name">{displayName}</span>
            <span className="global-sidebar__user-role">{displayRole}</span>
          </div>
        </div>

        <button
          className="global-sidebar__logout"
          onClick={handleLogout}
          title="Cerrar sesión"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;