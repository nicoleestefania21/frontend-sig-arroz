function getStatusClass(estado) {
    if (estado === "Activo") return "badge badge-success";
    if (estado === "En preparación") return "badge badge-warning";
    return "badge badge-muted";
}
 
function LotTable({ lots = [], selectedFarm, onEdit }) {
    // Estado: ninguna finca seleccionada
    if (!selectedFarm) {
        return (
            <div>
                <div className="section-header">
                    <h2>Lotes registrados</h2>
                    <p>Selecciona una finca para visualizar sus lotes.</p>
                </div>
                <div className="empty-box">
                    Selecciona una finca en la lista para consultar sus lotes.
                </div>
            </div>
        );
    }
 
    return (
        <div>
            <div className="section-header">
                <h2>Lotes registrados</h2>
                <p>
                    Lotes asociados a <strong>{selectedFarm.nombre}</strong> —{" "}
                    {lots.length === 0
                        ? "ningún lote registrado aún"
                        : `${lots.length} lote${lots.length !== 1 ? "s" : ""} encontrado${lots.length !== 1 ? "s" : ""}`}
                </p>
            </div>
 
            {lots.length === 0 ? (
                <div className="empty-box">
                    Esta finca no tiene lotes registrados todavía. Usa el formulario de arriba para agregar uno.
                </div>
            ) : (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Área (ha)</th>
                                <th>Ubicación</th>
                                <th>Tipo de suelo</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
 
                        <tbody>
                            {lots.map((lot) => (
                                <tr key={lot.id}>
                                    <td>{lot.area}</td>
                                    <td>{lot.ubicacion}</td>
                                    <td>{lot.tipoSuelo}</td>
                                    <td>
                                        <span className={getStatusClass(lot.estado)}>
                                            {lot.estado}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn-link"
                                            onClick={() => onEdit(lot)}
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
 
export default LotTable;