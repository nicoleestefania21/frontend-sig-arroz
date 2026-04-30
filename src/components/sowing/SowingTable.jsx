/**
 * SowingTable
 * ------------
 * Muestra las siembras registradas para el lote seleccionado.
 * Props:
 *  - siembras  {Array}    Lista de siembras a mostrar
 *  - lots      {Array}    Lista de lotes (para mostrar nombre en vez de ID)
 *  - onDelete  {Function} Callback para eliminar una siembra por ID
 */

const METODO_LABELS = {
  TRASPLANTE: "Trasplante",
  SIEMBRA_DIRECTA: "Siembra directa",
  VOLEO: "Voleo",
};

function SowingTable({ siembras = [], lots = [], onDelete }) {
  if (siembras.length === 0) {
    return (
      <div className="section-header">
        <h2>Siembras registradas</h2>
        <div className="empty-box">
          No hay siembras registradas. Completa el formulario para agregar la primera.
        </div>
      </div>
    );
  }

  const getLoteName = (loteId) => {
    const lot = lots.find((l) => l.id === loteId);
    return lot ? lot.nombre : `Lote #${loteId}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="siembra-table-wrapper">
      <div className="section-header">
        <h2>Siembras registradas</h2>
        <p>{siembras.length} siembra{siembras.length !== 1 ? "s" : ""} en este ciclo.</p>
      </div>

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Lote</th>
              <th>Fecha de siembra</th>
              <th>Variedad</th>
              <th>Densidad (kg/ha)</th>
              <th>Método</th>
              {/*
               * TODO (HU#3): Agregar columna "Ciclo" cuando la entidad
               * ciclo esté implementada en el backend.
               */}
              <th>Ciclo</th>
              <th>Observaciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {siembras.map((s) => (
              <tr key={s.id}>
                <td>{getLoteName(s.lote)}</td>
                <td>{formatDate(s.fecha_siembra)}</td>
                <td>{s.variedad}</td>
                <td>{s.densidad_kg_ha}</td>
                <td>
                  <span className="badge badge--method">
                    {METODO_LABELS[s.metodo_siembra] || s.metodo_siembra}
                  </span>
                </td>
                {/* TODO (HU#3): Mostrar nombre real del ciclo */}
                <td>
                  <span className="badge badge--mock">{s.ciclo_id} ⚠</span>
                </td>
                <td className="td-obs">{s.observaciones || "—"}</td>
                <td>
                  <button
                    className="btn-icon btn-icon--danger"
                    title="Eliminar siembra"
                    onClick={() => {
                      if (window.confirm("¿Eliminar esta siembra?")) {
                        onDelete(s.id);
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4h6v2" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SowingTable;