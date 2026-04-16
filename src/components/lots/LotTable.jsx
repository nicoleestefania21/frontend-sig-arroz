function getStatusClass(estado) {
    if (estado === "Activo") return "badge badge-success";
    if (estado === "En preparación") return "badge badge-warning";
    return "badge badge-muted";
}

function LotTable({ lots = [], selectedFarm, onEdit }) {
    return (
        <div>
            <div className="section-header">
                <h2>Lotes registrados</h2>
                <p>
                    {selectedFarm
                        ? `Lotes asociados a ${selectedFarm.nombre}.`
                        : "Selecciona una finca para visualizar sus lotes."}
                </p>
            </div>

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
                    {lots.length > 0 ? (
                        lots.map((lot) => (
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
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No hay lotes registrados para esta finca.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default LotTable;