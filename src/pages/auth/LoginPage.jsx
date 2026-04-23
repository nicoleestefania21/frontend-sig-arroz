import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/login.css";

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="login-page">
      <div className="login-card">

        {/* Panel izquierdo — branding */}
        <div className="login-brand">
          <div className="login-brand__top">
            <div className="login-brand__logo">
              <div className="login-brand__logo-mark">🌾</div>
              <span className="login-brand__logo-name">SIGARROZ</span>
            </div>
            <h2>Gestión inteligente del cultivo de arroz</h2>
            <p>
              Centraliza el registro de tus fincas, lotes, usuarios y
              procesos agrícolas en un solo lugar.
            </p>
            <div className="login-brand__features">
              <div className="login-brand__feature">
                <span className="login-brand__feature-dot" />
                Registro de fincas y lotes
              </div>
              <div className="login-brand__feature">
                <span className="login-brand__feature-dot" />
                Control de usuarios y roles
              </div>
              <div className="login-brand__feature">
                <span className="login-brand__feature-dot" />
                Seguimiento de procesos agrícolas
              </div>
            </div>
          </div>
          <div className="login-brand__bottom">
            © 2026 SIGARROZ — Sistema de gestión arrocera
          </div>
        </div>

        {/* Panel derecho — formulario */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form__header">
            <h1>Bienvenido de nuevo</h1>
            <p>Ingresa tus credenciales para acceder al sistema.</p>
          </div>

          {error && (
            <div className="login-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Ingresa tu usuario"
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Ingresando…" : "Iniciar sesión"}
          </button>
        </form>

      </div>
    </div>
  );
}

export default LoginPage;