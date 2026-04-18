import { useState } from "react";

function LoginForm({ onSubmit, error }) {
  const [form, setForm] = useState({
    correo: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="login-form__header">
        <h1>Iniciar sesión</h1>
        <p>Accede a la plataforma SIG-ARROZ con tus credenciales.</p>
      </div>

      <div className="form-group">
        <label>Correo electrónico</label>
        <input
          type="email"
          name="correo"
          value={form.correo}
          onChange={handleChange}
          placeholder="ejemplo@sigarroz.com"
          required
        />
      </div>

      <div className="form-group">
        <label>Contraseña</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Ingresa tu contraseña"
          required
        />
      </div>

      {error && <div className="login-error">{error}</div>}

      <button type="submit" className="btn btn-primary login-btn">
        Entrar
      </button>
    </form>
  );
}

export default LoginForm;