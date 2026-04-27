import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/login.css";

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/fincas-lotes", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        <div className="login-brand">
          <h2>SIGARROZ</h2>
          <p>
            Plataforma para la gestión de fincas, lotes, usuarios y procesos
            agrícolas.
          </p>
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
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;