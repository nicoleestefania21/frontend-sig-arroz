import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/home.css";

const modules = [
    {
        title: "Fincas y lotes",
        description: "Registra y administra fincas, asocia lotes con área, tipo de suelo y estado.",
        icon: "🌾",
        path: "/fincas-lotes",
        color: "card-green",
    },
    {
        title: "Usuarios",
        description: "Gestiona los usuarios del sistema y sus roles de acceso.",
        icon: "👥",
        path: "/usuarios",
        color: "card-blue",
    },
];

const stats = [
    { label: "Fincas registradas", value: 2, icon: "🏡" },
    { label: "Lotes activos", value: 3, icon: "📐" },
    { label: "Usuarios del sistema", value: 4, icon: "👤" },
];

function HomePage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const today = new Date().toLocaleDateString("es-CO", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="home">
            {/* Bienvenida */}
            <div className="home__welcome">
                <div>
                    <h1 className="home__title">
                        Bienvenido{user?.nombre ? `, ${user.nombre}` : ""}
                    </h1>
                    <p className="home__date">{today}</p>
                </div>
                <span className="home__badge">SIG-ARROZ</span>
            </div>

            {/* Estadísticas */}
            <div className="home__stats">
                {stats.map((stat) => (
                    <div key={stat.label} className="stat-card">
                        <span className="stat-card__icon">{stat.icon}</span>
                        <div>
                            <p className="stat-card__value">{stat.value}</p>
                            <p className="stat-card__label">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Accesos rápidos */}
            <h2 className="home__section-title">Módulos disponibles</h2>
            <div className="home__modules">
                {modules.map((mod) => (
                    <button
                        key={mod.path}
                        className={`module-card ${mod.color}`}
                        onClick={() => navigate(mod.path)}
                    >
                        <span className="module-card__icon">{mod.icon}</span>
                        <div className="module-card__body">
                            <h3>{mod.title}</h3>
                            <p>{mod.description}</p>
                        </div>
                        <span className="module-card__arrow">→</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default HomePage;