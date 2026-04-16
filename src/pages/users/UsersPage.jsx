import { useMemo, useState } from "react";
import UserForm from "../../components/users/UserForm";
import UserTable from "../../components/users/UserTable";
import RolePermissions from "../../components/users/RolePermissions";
import "../../styles/users.css";

const initialUsers = [
  {
    id: 1,
    nombre: "Nicole Angarita",
    correo: "nicole@sigarroz.com",
    rol: "Administrador",
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Carlos Gómez",
    correo: "tecnico@sigarroz.com",
    rol: "Técnico",
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Ana Pérez",
    correo: "productor@sigarroz.com",
    rol: "Productor",
    estado: "Inactivo",
  },
];

function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("Administrador");
  const [editingUser, setEditingUser] = useState(null);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
        `${user.nombre} ${user.correo} ${user.rol} ${user.estado}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );
  }, [users, search]);

  const handleSaveUser = (formData) => {
    if (editingUser) {
      setUsers((prev) =>
          prev.map((user) =>
              user.id === editingUser.id ? { ...user, ...formData } : user
          )
      );
      setEditingUser(null);
      return;
    }

    const newUser = {
      id: Date.now(),
      ...formData,
    };

    setUsers((prev) => [...prev, newUser]);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  return (
      <>
        <header className="content__header">
          <div>
            <h1>Gestión de usuarios</h1>
            <p>Administra usuarios, roles y permisos del sistema.</p>
          </div>

          <input
              type="text"
              placeholder="Buscar usuario..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
          />
        </header>

        <section className="content__grid">
          <div className="card">
            <UserForm
                onSave={handleSaveUser}
                editingUser={editingUser}
                onCancelEdit={handleCancelEdit}
                onRoleChange={setSelectedRole}
            />
          </div>

          <div className="card">
            <RolePermissions selectedRole={selectedRole} />
          </div>
        </section>

        <section className="card">
          <UserTable users={filteredUsers} onEdit={handleEditUser} />
        </section>
      </>
  );
}

export default UsersPage;