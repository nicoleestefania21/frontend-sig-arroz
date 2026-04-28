// src/pages/users/UsersPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import UserForm from "../../components/users/UserForm";
import UserTable from "../../components/users/UserTable";
import RolePermissions from "../../components/users/RolePermissions";
import "../../styles/users.css";
import { API } from "../../config/api";

function UsersPage() {
  const { authFetch, user: currentUser, isAdmin } = useAuth();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("ADMIN");
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Si por alguna razón entra alguien que no es admin
  if (!isAdmin) {
    return (
      <>
        <header className="content__header">
          <div>
            <h1>Gestión de usuarios</h1>
            <p>No tienes permisos para acceder a esta sección.</p>
          </div>
        </header>
      </>
    );
  }

  // ── Cargar usuarios desde el backend ─────────────────────
  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const res = await authFetch(`${API.users}/list/`, { method: "GET" });
        if (!res.ok) {
          console.error("Error al cargar usuarios:", res.status);
          setError("No se pudieron cargar los usuarios.");
          return;
        }
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error de red al cargar usuarios:", err);
        setError("Error de conexión al cargar usuarios.");
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, [authFetch]);

  // ── Búsqueda ─────────────────────────────────────────────
  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      `${user.first_name || ""} ${user.last_name || ""} ${user.username
        } ${user.email || ""} ${user.role} ${user.estado}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [users, search]);

  // ── Guardar / actualizar usuario ─────────────────────────
  const handleSaveUser = async (formData) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (editingUser) {
        // EDITAR usuario existente
        const payload = {
          username: editingUser.username, // no dejamos cambiar username
          first_name: formData.nombre.split(" ")[0] || "",
          last_name: formData.nombre.split(" ").slice(1).join(" ") || "",
          email: formData.correo,
          role: mapRolFrontToBack(formData.rol),
          estado: formData.estado === "Activo" ? "ACTIVO" : "INACTIVO",
        };

        const res = await authFetch(`${API.users}/${editingUser.id}/`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(
            data.detail ||
            data.message ||
            "Error al actualizar usuario. Revisa los datos."
          );
          setLoading(false);
          return;
        }

        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? data : u))
        );
        setEditingUser(null);
        setSuccess("Usuario actualizado correctamente.");
      } else {
        // CREAR usuario nuevo
        const payload = {
          username: formData.username,
          password: formData.password,
          first_name: formData.nombre.split(" ")[0] || "",
          last_name: formData.nombre.split(" ").slice(1).join(" ") || "",
          email: formData.correo,
          role: mapRolFrontToBack(formData.rol),
          estado: formData.estado === "Activo" ? "ACTIVO" : "INACTIVO",
        };

        const res = await authFetch(`${API.users}/register/`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        const data = await res.json();

        if (!res.ok) {
          const msg =
            data.message ||
            data.detail ||
            JSON.stringify(data) ||
            "Error al registrar usuario.";
          setError(msg);
          setLoading(false);
          return;
        }

        // Vuelve a cargar la lista
        const resList = await authFetch(`${API.users}/list/`, {
          method: "GET",
        });
        if (resList.ok) {
          const list = await resList.json();
          setUsers(list);
        }

        setSuccess("Usuario creado correctamente.");
      }
    } catch (err) {
      console.error("Error de red al guardar usuario:", err);
      setError("Error de conexión al guardar usuario.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);

    const rolFront = mapRolBackToFront(user.role);
    setSelectedRole(rolFront);
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
            loading={loading}
          />
          {error && (
            <div className="users-alert users-alert--error">{error}</div>
          )}
          {success && (
            <div className="users-alert users-alert--success">{success}</div>
          )}
        </div>

        <div className="card">
          <RolePermissions selectedRole={selectedRole} />
        </div>
      </section>

      <section className="card">
        {loading && users.length === 0 ? (
          <p>Cargando usuarios...</p>
        ) : (
          <UserTable users={filteredUsers} onEdit={setEditingUser} />
        )}
      </section>
    </>
  );
}

// Mapear roles entre lo que ve el usuario y lo que guarda la BD
function mapRolFrontToBack(rolFront) {
  switch (rolFront) {
    case "Administrador":
      return "ADMIN";
    case "Técnico":
      return "TECNICO";
    case "Productor":
      return "PRODUCTOR";
    case "Operador":
      return "OPERADOR";
    default:
      return "PRODUCTOR";
  }
}

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

export default UsersPage;