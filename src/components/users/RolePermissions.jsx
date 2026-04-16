// src/components/users/RolePermissions.jsx
const permissionsMap = {
  Administrador: [
    "Registrar usuarios",
    "Asignar roles",
    "Gestionar permisos",
    "Acceder a toda la información",
  ],
  Técnico: [
    "Consultar lotes y ciclos",
    "Registrar monitoreos",
    "Registrar manejo agronómico",
    "Sin acceso a gestión de usuarios",
  ],
  Productor: [
    "Consultar información productiva",
    "Visualizar reportes",
    "Consultar historial del cultivo",
    "Sin permisos administrativos",
  ],
};

function RolePermissions({ selectedRole }) {
  const permissions = permissionsMap[selectedRole] || [];
  {permissions.map((permission) => (
  <li key={permission}>{permission}</li>
))}

  return (
    <div>
      <div className="section-header">
        <h2>Permisos del rol</h2>
        <p>Vista rápida del alcance del perfil seleccionado.</p>
      </div>

      <div className="permissions-box">
        <span className="role-chip">{selectedRole}</span>

        <ul className="permissions-list">
          {permissions.map((permission) => (
            <li key={permission}>{permission}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RolePermissions;