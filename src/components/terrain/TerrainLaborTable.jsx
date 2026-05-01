function TerrainLaborTable({
    labors,
    selectedLot,
    filters,
    onFilterChange,
    onEdit,
    onDelete,
    formatDate,
}) {
    const renderActions = (labor) => {
        const actions = [];
        if (labor.nivelacion) actions.push("Nivelación");
        if (labor.drenaje) actions.push("Drenaje");
        if (labor.adecuacion) actions.push("Adecuación");
        return actions.length ? actions.join(", ") : "Sin acciones marcadas";
    };

    if (!selectedLot) {
        return (
            <div className="table-wrapper">
                <div className="section-header">
                    <h2>Historial de preparación</h2>
                    <p>Selecciona un lote para consultar sus registros.</p>
                </div>
                <div className="tl-empty-box">
                    No hay un lote activo para consultar historial.
                </div>
            </div>
        );
    }

    return (
        <div className="table-wrapper">
            <div className="section-header">
                <h2>Historial de preparación del terreno</h2>
                <p>
                    Registros asociados a <strong>{selectedLot.nombre}</strong>.
                </p>
            </div>

            <div className="tl-filters">
                <div className="form-group">
                    <label>Filtrar por tipo de labor</label>
                    <input
                        type="text"
                        value={filters.tipo}
                        onChange={(e) =>
                            onFilterChange((prev) => ({ ...prev, tipo: e.target.value }))
                        }
                        placeholder="Ej. drenaje, arado, nivelación"
                    />
                </div>

                <div className="form-group">
                    <label>Filtrar por fecha</label>
                    <input
                        type="date"
                        value={filters.fecha}
                        onChange={(e) =>
                            onFilterChange((prev) => ({ ...prev, fecha: e.target.value }))
                        }
                    />
                </div>

                <div className="tl-filter-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => onFilterChange({ tipo: "", fecha: "" })}
                    >
                        Limpiar filtros
                    </button>
                </div>
            </div>

            {!labors.length ? (
                <div className="tl-empty-box">
                    Este lote no tiene registros para los filtros seleccionados.
                </div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Tipo de labor</th>
                            <th>Condiciones</th>
                            <th>Adecuaciones</th>
                            <th>Estado del terreno</th>
                            <th>Observaciones</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {labors.map((labor) => (
                            <tr key={labor.id}>
                                <td>{formatDate(labor.fecha)}</td>
                                <td>
                                    <span className="tl-pill">{labor.tipo_labor}</span>
                                </td>
                                <td>
                                    <div className="tl-mini-stack">
                                        <span>pH: {labor.ph ?? "N/R"}</span>
                                        <span>Humedad: {labor.humedad ?? "N/R"}%</span>
                                    </div>
                                </td>
                                <td>{renderActions(labor)}</td>
                                <td>
                                    <span className="badge badge-success">{labor.estado_terreno}</span>
                                </td>
                                <td>{labor.observaciones || "Sin observaciones"}</td>
                                <td>
                                    <div className="tl-table-actions">
                                        <button
                                            type="button"
                                            className="tl-action-link tl-action-link--edit"
                                            onClick={() => onEdit(labor)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            type="button"
                                            className="tl-action-link tl-action-link--delete"
                                            onClick={() => onDelete(labor.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default TerrainLaborTable;