import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "../../styles/login.css";

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/fincas-lotes", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login({
      username: form.username,
      password: form.password,
    });

    if (!result.ok) {
      setError(result.message);
      setLoading(false);
      return;
    }

    navigate("/fincas-lotes", { replace: true });
  };

  return (
    <div className="login-shell">
      <div className="login-shell__glow login-shell__glow--one" />
      <div className="login-shell__glow login-shell__glow--two" />

      <main className="login-frame">
        <section className="login-showcase" aria-label="Presentación de SIGARROZ">
          <div className="login-showcase__surface">
            <header className="login-brandbar">
              <div className="login-brandbar__mark" aria-hidden="true">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.5" width="39" height="39" rx="12" fill="url(#brandFill)" />
                  <path d="M20 30V13.5" stroke="white" strokeWidth="1.9" strokeLinecap="round" />
                  <ellipse cx="20" cy="11" rx="3.4" ry="5.4" fill="white" fillOpacity="0.95" />
                  <path d="M20 20.5C15 19 12.6 15.8 13.8 12.8" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.78" />
                  <path d="M20 18.2C24.8 16.6 27.5 13.6 26.2 10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.72" />
                  <path d="M11.5 31.2C14.7 29.4 17.5 29 20 29.8C22.8 30.7 25.4 30.4 28.4 29" stroke="white" strokeWidth="1.35" strokeLinecap="round" opacity="0.45" />
                  <defs>
                    <linearGradient id="brandFill" x1="6" y1="4" x2="34" y2="36" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#2B8C66" />
                      <stop offset="1" stopColor="#15513A" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="login-brandbar__text">
                <span className="login-brandbar__name">SIGARROZ</span>
                <span className="login-brandbar__tag">Plataforma agrícola inteligente</span>
              </div>
            </header>

            <div className="login-showcase__content">
              <div className="login-hero">
                <span className="login-badge">Operación organizada · decisión más clara</span>
                <h1 className="login-hero__title">
                  Una experiencia agrícola clara, moderna y agradable de usar.
                </h1>
                <p className="login-hero__text">
                  Administra fincas, lotes, usuarios y procesos desde una interfaz
                  limpia, bien estructurada y pensada para trabajar con fluidez.
                </p>
              </div>

              <article className="login-panel login-panel--feature">
                <span className="login-panel__eyebrow">Enfoque</span>
                <h2>Control visual con orden real</h2>
                <p>
                  Una interfaz más ordenada, rápida de leer y agradable de usar.
                </p>

                <ul className="login-benefits" role="list">
                  <li>Fincas y lotes mejor organizados</li>
                  <li>Usuarios y accesos más claros</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="login-access" aria-label="Acceso al sistema">
          <div className="login-access__card">
            <div className="login-access__topbar">
              <span className="login-access__dot" aria-hidden="true" />
              <p>Acceso seguro al sistema</p>
            </div>

            <div className="login-access__header">
              <h2>Bienvenido de nuevo</h2>
              <p>Ingresa tus credenciales para continuar en SIGARROZ.</p>
            </div>

            {error && (
              <div className="login-error" role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="form-field">
                <label htmlFor="username" className="form-label">
                  Usuario
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  className="form-input"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Ingresa tu usuario"
                  autoComplete="username"
                  required
                />
              </div>

              <div className="form-field">
                <div className="form-label-row">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    className="login-link-button"
                    onClick={() => navigate("/recuperar-contrasena")}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <div className="form-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-input form-input--password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Ingresa tu contraseña"
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="form-eye-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="login-btn__spinner" aria-hidden="true" />
                    Ingresando…
                  </>
                ) : (
                  "Iniciar sesión"
                )}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LoginPage;