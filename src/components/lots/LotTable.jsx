function getStatusClass(estado) {
    if (estado === "DISPONIBLE") return "badge badge-success";
    if (estado === "EN_PREPARACION") return "badge badge-warning";
    if (estado === "EN_USO") return "badge badge-muted";
    if (estado === "INACTIVO") return "badge badge-muted";
    return "badge badge-muted";
}

function LotTable({ lots = [], selectedFarm, onEdit, onDelete }) {
    if (!selectedFarm) {
        return (
            <div className="empty-box">
                Selecciona una finca para visualizar sus lotes.
            </div>
        );
    }

    return (
        <div className="table-wrapper">
            <div className="section-header">
                <h2>
                    Lotes asociados a <strong>{selectedFarm.nombre}</strong>
                </h2>
                <p>
                    {lots.length === 0
                        ? "Ningún lote registrado aún."
                        : `${lots.length} lote${lots.length !== 1 ? "s" : ""} encontrado${lots.length !== 1 ? "s" : ""
                        }.`}
                </p>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Nombre / ubicación</th>
                        <th>Área (ha)</th>
                        <th>Tipo de suelo</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {lots.length === 0 ? (
                        <tr>
                            <td colSpan={5} style={{ color: "#6b7280", textAlign: "center" }}>
                                No hay lotes registrados para esta finca.
                            </td>
                        </tr>
                    ) : (
                        lots.map((lot) => (
                            <tr key={lot.id}>
                                <td>{lot.nombre || lot.ubicacion || "Sin nombre"}</td>
                                <td>{lot.area}</td>
                                <td>{lot.tipo_suelo || lot.tipoSuelo}</td>
                                <td>
                                    <span className={getStatusClass(lot.estado)}>
                                        {lot.estado_display || lot.estado}
                                    </span>
                                </td>
                                <td style={{ display: "flex", gap: "8px" }}>
                                    <button
                                        type="button"
                                        className="btn-link"
                                        onClick={() => onEdit(lot)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-link"
                                        style={{ color: "#dc2626" }}
                                        onClick={() => onDelete(lot.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default LotTable;