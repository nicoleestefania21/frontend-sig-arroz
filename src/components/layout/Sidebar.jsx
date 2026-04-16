import { NavLink } from "react-router-dom";

function Sidebar() {
    return (
        <aside className="global-sidebar">
            <div className="global-sidebar__brand">
                <h2>SIG-ARROZ</h2>
                <p>Panel del sistema</p>
            </div>

            <nav className="global-sidebar__nav">
                <NavLink
                    to="/inicio"
                    className={({ isActive }) =>
                        isActive
                            ? "global-sidebar__item global-sidebar__item--active"
                            : "global-sidebar__item"
                    }
                >
                    Inicio
                </NavLink>

                <NavLink
                    to="/fincas-lotes"
                    className={({ isActive }) =>
                        isActive
                            ? "global-sidebar__item global-sidebar__item--active"
                            : "global-sidebar__item"
                    }
                >
                    Registro de fincas y lotes
                </NavLink>

                <NavLink
                    to="/usuarios"
                    className={({ isActive }) =>
                        isActive
                            ? "global-sidebar__item global-sidebar__item--active"
                            : "global-sidebar__item"
                    }
                >
                    Gestión de usuarios
                </NavLink>
            </nav>
        </aside>
    );
}

export default Sidebar;