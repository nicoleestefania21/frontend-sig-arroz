function FarmList({ farms = [], selectedFarmId, onSelect, onEdit, onDelete }) {
    if (farms.length === 0) {
        return (
            <>
                <div className="section-header">
                    <h2>Fincas registradas</h2>
                    <p>Aún no hay fincas. Registra la primera.</p>
                </div>
                <div className="empty-box">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    No hay fincas registradas todavía.
                </div>
            </>
        );
    }

    return (
        <>
            <div className="section-header">
                <h2>Fincas registradas</h2>
                <p>
                    {farms.length} finca{farms.length !== 1 ? "s" : ""} en el sistema.
                    Selecciona una para ver sus lotes.
                </p>
            </div>

            <div className="farm-list">
                {farms.map((farm) => (
                    <div
                        key={farm.id}
                        className={`farm-item${selectedFarmId === farm.id ? " farm-item--active" : ""}`}
                        onClick={() => onSelect(farm.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && onSelect(farm.id)}
                        aria-pressed={selectedFarmId === farm.id}
                    >
                        <div className="farm-item__header">
                            <h3>{farm.nombre}</h3>
                            {farm.area_total && (
                                <span className="farm-item__area">{farm.area_total} ha</span>
                            )}
                        </div>
                        <p>{farm.municipio}, {farm.departamento}</p>
                        {farm.vereda && (
                            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-faint)" }}>
                                Vereda {farm.vereda}
                            </p>
                        )}

                        {(onEdit || onDelete) && (
                            <div className="farm-item__actions">
                                {onEdit && (
                                    <button
                                        type="button"
                                        className="btn-link"
                                        onClick={(e) => { e.stopPropagation(); onEdit(farm); }}
                                        aria-label={`Editar ${farm.nombre}`}
                                    >
                                        Editar
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        type="button"
                                        className="btn-link-danger"
                                        onClick={(e) => { e.stopPropagation(); onDelete(farm.id); }}
                                        aria-label={`Eliminar ${farm.nombre}`}
                                    >
                                        Eliminar
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}

export default FarmList;