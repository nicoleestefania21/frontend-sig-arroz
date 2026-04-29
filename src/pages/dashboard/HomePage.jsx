import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/home.css";

const modules = [
    {
        title: "Fincas y lotes",
        description:
            "Registra fincas, organiza lotes y controla el estado agrícola desde una sola vista.",
        path: "/fincas-lotes",
        badge: "Operación agrícola",
        tone: "green",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 20h16" />
                <path d="M7 20v-6l5-4 5 4v6" />
                <path d="M10 20v-3h4v3" />
                <path d="M12 5c1 2 1 3 0 5" />
                <path d="M9 8c1 1 2 2 3 2" />
                <path d="M15 8c-1 1-2 2-3 2" />
            </svg>
        ),
    },
    {
        title: "Usuarios",
        description:
            "Administra accesos, perfiles y roles del sistema con una gestión más clara.",
        path: "/users",
        badge: "Administración",
        tone: "blue",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                <circle cx="9.5" cy="8" r="3.5" />
                <path d="M17 11a3 3 0 1 0 0-6" />
                <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
            </svg>
        ),
    },
];

function formatToday() {
    return new Intl.DateTimeFormat("es-CO", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date());
}

function HomePage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const today = formatToday();
    const displayName = user?.nombre || user?.username || "administrador";

    return (
        <div className="home-page">
            <section className="home-hero home-hero--single">
                <div className="home-hero__main home-hero__main--wide">
                    <div className="home-hero__topline">
                        <span className="home-kicker">Panel principal</span>
                        <span className="home-brand-pill">SIG-ARROZ</span>
                    </div>

                    <h1 className="home-title">Bienvenido, {displayName}</h1>
                    <p className="home-date">{today}</p>
                    <p className="home-description">
                        Accede rápidamente a los módulos principales desde una
                        portada más limpia, sólida y profesional.
                    </p>
                </div>
            </section>

            <section className="home-layout home-layout--single">
                <article className="home-section-card home-section-card--modules home-section-card--full">
                    <div className="home-section-card__head">
                        <span className="home-kicker">Accesos</span>
                        <h2>Módulos disponibles</h2>
                        <p>
                            Áreas principales del sistema presentadas con mayor
                            orden y jerarquía para entrar más rápido y con mejor
                            lectura visual.
                        </p>
                    </div>

                    <div className="module-grid">
                        {modules.map((mod) => (
                            <button
                                key={mod.path}
                                type="button"
                                className={`module-card module-card--${mod.tone}`}
                                onClick={() => navigate(mod.path)}
                            >
                                <div className="module-card__header">
                                    <span className="module-card__badge">{mod.badge}</span>
                                    <span className="module-card__glyph" aria-hidden="true">
                                        {mod.icon}
                                    </span>
                                </div>

                                <div className="module-card__body">
                                    <h3>{mod.title}</h3>
                                    <p>{mod.description}</p>
                                </div>

                                <span className="module-card__cta">Entrar al módulo</span>
                            </button>
                        ))}
                    </div>
                </article>
            </section>
        </div>
    );
}

export default HomePage;