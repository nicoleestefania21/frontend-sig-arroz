// src/components/users/UserForm.jsx
import { useEffect, useState } from "react";

const initialForm = {
  nombre: "",
  correo: "",
  rol: "Administrador",
  estado: "Activo",
  username: "",
  password: "",
};

function UserForm({ onSave, editingUser, onCancelEdit, onRoleChange, loading }) {
  const [form, setForm] = useState(initialForm);

  // Cuando cambia el usuario en edición o se pasa a modo creación
  useEffect(() => {
    if (editingUser) {
      const nombreCompleto = `${editingUser.first_name || ""} ${
        editingUser.last_name || ""
      }`.trim();

      setForm({
        nombre: nombreCompleto || editingUser.username || "",
        correo: editingUser.email || "",
        rol: mapRolBackToFront(editingUser.role),
        estado: editingUser.estado === "ACTIVO" ? "Activo" : "Inactivo",
        username: editingUser.username,
        password: "", // no mostramos ni editamos la contraseña existente
      });

      onRoleChange(mapRolBackToFront(editingUser.role));
    } else {
      setForm(initialForm);
      onRoleChange("Administrador");
    }
  }, [editingUser, onRoleChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "rol") {
      onRoleChange(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica
    if (!form.nombre.trim() || !form.correo.trim()) return;

    // Para crear: si no se ha puesto username, usamos el correo
    const username =
      form.username && form.username.trim().length > 0
        ? form.username.trim()
        : form.correo.trim();

    const payload = {
      ...form,
      username,
    };

    onSave(payload);

    if (!editingUser) {
      setForm(initialForm);
      onRoleChange("Administrador");
    }
  };

  return (
    <div>
      <div className="section-header">
        <h2>{editingUser ? "Editar usuario" : "Registrar usuario"}</h2>
        <p>Completa la información base del acceso.</p>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre completo</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej: Nicole Angarita"
            required
          />
        </div>

        <div className="form-group">
          <label>Correo electrónico</label>
          <input
            type="email"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            placeholder="usuario@correo.com"
            required
          />
        </div>

        {/* Solo permitir cambiar username y password cuando se crea */}
        {!editingUser && (
          <>
            <div className="form-group">
              <label>Nombre de usuario</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Ej: nangarita"
              />
              <small className="form-hint">
                Si lo dejas en blanco, se usará el correo como usuario.
              </small>
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Contraseña temporal"
                required
              />
            </div>
          </>
        )}

        <div className="form-row">
          <div className="form-group">
            <label>Rol</label>
            <select name="rol" value={form.rol} onChange={handleChange}>
              <option>Administrador</option>
              <option>Técnico</option>
              <option>Productor</option>
              <option>Operador</option>
            </select>
          </div>

          <div className="form-group">
            <label>Estado</label>
            <select name="estado" value={form.estado} onChange={handleChange}>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          {editingUser && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancelEdit}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading
              ? "Guardando..."
              : editingUser
              ? "Guardar cambios"
              : "Registrar usuario"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Funciones de mapeo front ↔ back usadas aquí también
function mapRolBackToFront(rolBack) {
  switch (rolBack) {
    case "ADMIN":
      return "Administrador";
    case "TECNICO":
      return "Técnico";
    case "PRODUCTOR":
      return "Productor";
    case "OPERADOR":
      return "Operador";
    default:
      return "Productor";
  }
}

export default UserForm;