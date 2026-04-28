import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/login.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/users";

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Estado para el modal de recuperación
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState(""); // "loading" | "sent" | "error"
  const [resetMsg, setResetMsg] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/fincas-lotes", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login({ username: form.username, password: form.password });

    if (!result.ok) {
      setError(result.message);
      setLoading(false);
      return;
    }
    navigate("/fincas-lotes", { replace: true });
  };

  // Recuperación de contraseña
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetStatus("loading");
    setResetMsg("");

    try {
      const res = await fetch(`${API_URL}/password-reset/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      setResetStatus("sent");
      setResetMsg(data.message);
    } catch {
      setResetStatus("error");
      setResetMsg("Error de conexión. Intenta de nuevo.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <h2>SIGARROZ</h2>
          <p>Plataforma para la gestión de fincas, lotes, usuarios y procesos agrícolas.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form__header">
            <h1>Iniciar sesión</h1>
            <p>Ingresa tus credenciales para continuar.</p>
          </div>

          {error && <div className="login-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Ingresa tu usuario"
              required
              autoComplete="username"
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
              required
              autoComplete="current-password"
            />
          </div>

          {/* Enlace de recuperación */}
          <div className="login-forgot">
            <button
              type="button"
              className="btn-link"
              onClick={() => { setShowReset(true); setResetStatus(""); setResetMsg(""); }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>

      {/* Modal: recuperar contraseña */}
      {showReset && (
        <div className="modal-overlay" onClick={() => setShowReset(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>Recuperar contraseña</h2>

            {resetStatus !== "sent" ? (
              <>
                <p>Ingresa tu correo registrado y te enviaremos instrucciones.</p>
                <form onSubmit={handleResetSubmit}>
                  <div className="form-group">
                    <label htmlFor="reset-email">Correo electrónico</label>
                    <input
                      id="reset-email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      required
                    />
                  </div>
                  {resetStatus === "error" && (
                    <div className="login-error">{resetMsg}</div>
                  )}
                  <div className="modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowReset(false)}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={resetStatus === "loading"}>
                      {resetStatus === "loading" ? "Enviando..." : "Enviar instrucciones"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="reset-success">
                <p>✅ {resetMsg}</p>
                <p className="text-muted">Revisa tu bandeja de entrada (y la carpeta de spam).</p>
                <button className="btn btn-primary" onClick={() => setShowReset(false)}>
                  Volver al login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;