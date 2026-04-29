function getRoleLabel(role) {
  const roleLabels = {
    ADMIN: "Administrador",
    TECNICO: "Técnico",
    PRODUCTOR: "Productor",
    OPERADOR: "Operador",
  };

  return roleLabels[role] || role || "Sin rol";
}

function getStatusInfo(estado) {
  const normalized = (estado || "").toString().trim().toUpperCase();

  if (normalized === "ACTIVO") {
    return {
      label: "ACTIVO",
      className: "badge badge-success",
    };
  }

  return {
    label: "INACTIVO",
    className: "badge badge-muted",
  };
}

function UserTable({
  users = [],
  onEdit,
  onDelete,
  currentUserId,
  search = "",
  onSearchChange,
}) {
  return (
    <div>
      <div className="users-table-toolbar">
        <div className="users-table-toolbar__content">
          <h2>Usuarios registrados</h2>
          <p>
            Consulta y administra los accesos creados.{" "}
            {users.length === 0
              ? "No hay usuarios registrados."
              : `${users.length} usuario${users.length !== 1 ? "s" : ""} registrado${users.length !== 1 ? "s" : ""}.`}
          </p>
        </div>

        <div className="users-table-toolbar__actions">
          <label htmlFor="users-search" className="users-search-label">
            Buscar usuario
          </label>
          <input
            id="users-search"
            type="text"
            placeholder="Nombre, correo, rol o estado..."
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="users-search-input"
          />
        </div>
      </div>

      {users.length === 0 ? (
        <div className="empty-box users-empty-box">
          No hay usuarios registrados todavía.
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const nombreCompleto = `${u.first_name || ""} ${u.last_name || ""}`.trim();
                const displayName = nombreCompleto || u.username || "(sin nombre)";
                const displayEmail = u.email || "(sin correo)";
                const displayRole = getRoleLabel(u.role);
                const status = getStatusInfo(u.estado);

                return (
                  <tr key={u.id}>
                    <td>{displayName}</td>
                    <td>{displayEmail}</td>
                    <td>{displayRole}</td>
                    <td>
                      <span className={status.className}>{status.label}</span>
                    </td>
                    <td className="users-actions">
                      <button
                        type="button"
                        className="btn-link"
                        onClick={() => onEdit(u)}
                      >
                        Editar
                      </button>

                      {u.id !== currentUserId && (
                        <button
                          type="button"
                          className="btn-link btn-link-danger"
                          onClick={() => onDelete(u)}
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserTable;