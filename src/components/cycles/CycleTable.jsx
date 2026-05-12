function estadoBadge(estado) {
  const map = {
    PLANIFICADO: "badge-planificado",
    ACTIVO: "badge-activo",
    CERRADO: "badge-cerrado",
  };
  const labels = {
    PLANIFICADO: "Planificado",
    ACTIVO: "Activo",
    CERRADO: "Cerrado",
  };
  return <span className={map[estado] || ""}>{labels[estado] || estado}</span>;
}

function formatFecha(fecha) {
  if (!fecha) return "—";
  const [y, m, d] = fecha.split("-");
  return `${d}/${m}/${y}`;
}

function CycleTable({ ciclos, lots, onEdit, onDelete }) {
  const lotMap = Object.fromEntries(lots.map((l) => [l.id, l.nombre]));

  if (ciclos.length === 0) {
    return (
      <div>
        <h2 className="sw-section-title">Listado de ciclos</h2>
        <p style={{ color: "#888", marginTop: "1rem" }}>No hay ciclos registrados aún.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="sw-section-title">Listado de ciclos</h2>
      <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "1rem" }}>
        Revisa y gestiona los ciclos productivos registrados.
      </p>
      <div style={{ overflowX: "auto" }}>
        <table className="sw-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Lote</th>
              <th>Variedad</th>
              <th>Fecha inicio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ciclos.map((c) => (
              <tr key={c.id}>
                <td>{c.nombre}</td>
                <td>{lotMap[c.lote] || c.lote}</td>
                <td>{c.variedad_planificada || "—"}</td>
                <td>{formatFecha(c.fecha_inicio_estimada)}</td>
                <td>{estadoBadge(c.estado)}</td>
                <td style={{ display: "flex", gap: "0.4rem" }}>
                  <button className="btn-edit" onClick={() => onEdit(c)}>Editar</button>
                  <button className="btn-delete" onClick={() => onDelete(c.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CycleTable;