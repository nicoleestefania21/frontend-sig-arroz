import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import UserForm from "../../components/users/UserForm";
import UserTable from "../../components/users/UserTable";
import RolePermissions from "../../components/users/RolePermissions";
import "../../styles/users.css";
import { API } from "../../config/api";

async function parseResponse(res) {
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return await res.json();
  }

  return await res.text();
}

function UsersPage() {
  const { authFetch, user: currentUser, isAdmin } = useAuth();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("ADMIN");
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isAdmin) return;

    async function loadUsers() {
      try {
        setLoading(true);
        setError("");

        const res = await authFetch(`${API.users}/list/`, {
          method: "GET",
        });

        const data = await parseResponse(res);

        if (!res.ok) {
          console.error("Error al cargar usuarios:", data);
          setError("No se pudieron cargar los usuarios.");
          return;
        }

        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error de red al cargar usuarios:", err);
        setError("Error de conexión al cargar usuarios.");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [authFetch, isAdmin]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      `${user.first_name || ""} ${user.last_name || ""} ${user.username || ""} ${user.email || ""} ${user.role || ""} ${user.estado || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [users, search]);

  const userStats = useMemo(() => {
    const activos = users.filter((u) => u.estado === "ACTIVO").length;
    const admins = users.filter((u) => u.role === "ADMIN").length;
    const tecnicos = users.filter((u) => u.role === "TECNICO").length;

    return {
      total: users.length,
      activos,
      admins,
      tecnicos,
    };
  }, [users]);

  const handleSaveUser = async (formData) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (editingUser) {
        const payload = {
          username: editingUser.username,
          first_name: formData.nombre.split(" ")[0] || "",
          last_name: formData.nombre.split(" ").slice(1).join(" ") || "",
          email: formData.correo,
          role: mapRolFrontToBack(formData.rol),
          estado: formData.estado === "Activo" ? "ACTIVO" : "INACTIVO",
        };

        if (formData.password && formData.password.trim() !== "") {
          payload.password = formData.password;
        }

        const res = await authFetch(`${API.users}/${editingUser.id}/`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });

        const data = await parseResponse(res);

        if (!res.ok) {
          console.error("Error al actualizar usuario:", data);
          setError(
            typeof data === "string"
              ? "No se pudo actualizar el usuario. El servidor devolvió una respuesta no válida."
              : data.detail ||
              data.message ||
              JSON.stringify(data) ||
              "Error al actualizar usuario."
          );
          return;
        }

        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? data : u))
        );
        setEditingUser(null);
        setSelectedRole("ADMIN");
        setSuccess("Usuario actualizado correctamente.");
      } else {
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

        const data = await parseResponse(res);

        if (!res.ok) {
          console.error("Error al registrar usuario:", data);
          setError(
            typeof data === "string"
              ? "No se pudo registrar el usuario. El servidor devolvió una respuesta no válida."
              : data.message ||
              data.detail ||
              JSON.stringify(data) ||
              "Error al registrar usuario."
          );
          return;
        }

        const resList = await authFetch(`${API.users}/list/`, {
          method: "GET",
        });

        const listData = await parseResponse(resList);

        if (resList.ok && Array.isArray(listData)) {
          setUsers(listData);
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
    setSelectedRole(mapRolBackToFront(user.role));
    setError("");
    setSuccess("");
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setSelectedRole("ADMIN");
    setError("");
    setSuccess("");
  };

  const handleDeleteUser = async (userToDelete) => {
    setError("");
    setSuccess("");

    if (userToDelete.id === currentUser?.id) {
      setError("No puedes eliminar tu propio usuario.");
      return;
    }

    const confirmed = window.confirm(
      `¿Deseas eliminar al usuario ${userToDelete.first_name || userToDelete.username}?`
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const res = await authFetch(`${API.users}/${userToDelete.id}/`, {
        method: "DELETE",
      });

      const data = await parseResponse(res);

      if (!res.ok) {
        console.error("Error al eliminar usuario:", data);
        setError(
          typeof data === "string"
            ? "No se pudo eliminar el usuario. El servidor devolvió una respuesta no válida."
            : data.detail ||
            data.message ||
            "No se pudo eliminar el usuario."
        );
        return;
      }

      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));

      if (editingUser?.id === userToDelete.id) {
        setEditingUser(null);
        setSelectedRole("ADMIN");
      }

      setSuccess("Usuario eliminado correctamente.");
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      setError("Error de conexión al eliminar usuario.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="users-page">
        <header className="users-hero users-hero--compact">
          <div className="users-hero__content">
            <span className="users-eyebrow">Administración</span>
            <h1>Gestión de usuarios</h1>
            <p>No tienes permisos para acceder a esta sección.</p>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="users-page">
      <header className="users-hero">
        <div className="users-hero__content">
          <span className="users-eyebrow">Administración</span>
          <h1>Gestión de usuarios</h1>
          <p>
            Administra accesos, roles y permisos del sistema en una vista clara
            y centralizada.
          </p>
        </div>
      </header>

      <section className="users-stats">
        <article className="users-stat-card">
          <span>Total usuarios</span>
          <strong>{userStats.total}</strong>
          <p>Usuarios registrados en la plataforma.</p>
        </article>

        <article className="users-stat-card">
          <span>Usuarios activos</span>
          <strong>{userStats.activos}</strong>
          <p>Cuentas habilitadas para operar en el sistema.</p>
        </article>

        <article className="users-stat-card">
          <span>Administradores</span>
          <strong>{userStats.admins}</strong>
          <p>Usuarios con acceso total a la gestión.</p>
        </article>

        <article className="users-stat-card users-stat-card--accent">
          <span>Técnicos</span>
          <strong>{userStats.tecnicos}</strong>
          <p>Perfiles orientados al seguimiento operativo.</p>
        </article>
      </section>

      {error && <div className="users-alert users-alert--error">{error}</div>}
      {success && <div className="users-alert users-alert--success">{success}</div>}

      <section className="users-grid">
        <div className="users-panel">
          <UserForm
            onSave={handleSaveUser}
            editingUser={editingUser}
            onCancelEdit={handleCancelEdit}
            onRoleChange={setSelectedRole}
            loading={loading}
          />
        </div>

        <div className="users-panel users-panel--soft">
          <RolePermissions selectedRole={selectedRole} />
        </div>
      </section>

      <section className="users-table-panel">
        {loading && users.length === 0 ? (
          <div className="users-loading">Cargando usuarios...</div>
        ) : (
          <UserTable
            users={filteredUsers}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            currentUserId={currentUser?.id}
            search={search}
            onSearchChange={setSearch}
          />
        )}
      </section>
    </div>
  );
}

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