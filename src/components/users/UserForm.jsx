// src/components/users/UserForm.jsx
import { useEffect, useState } from "react";

const initialForm = {
  nombre: "",
  correo: "",
  rol: "Administrador",
  estado: "Activo",
};

function UserForm({ onSave, editingUser, onCancelEdit, onRoleChange }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (editingUser) {
      setForm(editingUser);
      onRoleChange(editingUser.rol);
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
    onSave(form);
    setForm(initialForm);
    onRoleChange("Administrador");
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

        <div className="form-row">
          <div className="form-group">
            <label>Rol</label>
            <select name="rol" value={form.rol} onChange={handleChange}>
              <option>Administrador</option>
              <option>Técnico</option>
              <option>Productor</option>
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
            <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
              Cancelar
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            {editingUser ? "Guardar cambios" : "Registrar usuario"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserForm;