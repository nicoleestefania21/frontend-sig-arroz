// src/components/users/UserTable.jsx
function UserTable({ users, onEdit }) {
  return (
    <div>
      <div className="section-header">
        <h2>Usuarios registrados</h2>
        <p>Consulta y administra los accesos creados.</p>
      </div>

      {users.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const nombreCompleto = `${u.first_name || ""} ${
                u.last_name || ""
              }`.trim();

              const displayName = nombreCompleto || u.username || "(sin nombre)";
              const displayEmail = u.email || "(sin correo)";

              const roleLabels = {
                ADMIN: "Administrador",
                TECNICO: "Técnico",
                PRODUCTOR: "Productor",
                OPERADOR: "Operador",
              };
              const displayRole = roleLabels[u.role] || u.role || "";

              const displayEstado =
                u.estado === "ACTIVO" || u.estado === "Activo"
                  ? "ACTIVO"
                  : "INACTIVO";

              return (
                <tr key={u.id}>
                  <td>{displayName}</td>
                  <td>{displayEmail}</td>
                  <td>{displayRole}</td>
                  <td>
                    <span className="badge badge--status">
                      {displayEstado}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => onEdit(u)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserTable;