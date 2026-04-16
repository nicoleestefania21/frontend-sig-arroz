// src/components/users/UserTable.jsx
function UserTable({ users, onEdit }) {
  return (
    <div>
      <div className="section-header">
        <h2>Usuarios registrados</h2>
        <p>Consulta y administra los accesos creados.</p>
      </div>

      <div className="table-wrapper">
        <table>
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
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.nombre}</td>
                  <td>{user.correo}</td>
                  <td>{user.rol}</td>
                  <td>
                    <span
                      className={
                        user.estado === "Activo"
                          ? "badge badge-success"
                          : "badge badge-muted"
                      }
                    >
                      {user.estado}
                    </span>
                  </td>
                  <td>
                    <button className="btn-link" onClick={() => onEdit(user)}>
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No se encontraron usuarios.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserTable;