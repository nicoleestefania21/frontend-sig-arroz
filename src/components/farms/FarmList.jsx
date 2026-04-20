function FarmList({ farms, selectedFarmId, onSelect, onEdit, onDelete }) {
    if (!farms || farms.length === 0) {
        return <div className="empty-box">No hay fincas registradas.</div>;
    }

    return (
        <div>
            <div className="section-header">
                <h2>Fincas registradas</h2>
                <p>Selecciona una finca para ver sus lotes.</p>
            </div>

            <ul className="farm-list">
                {farms.map((farm) => (
                    <li
                        key={farm.id}
                        className={
                            farm.id === selectedFarmId ? "farm-item farm-item--active" : "farm-item"
                        }
                        onClick={() => onSelect(farm.id)}
                    >
                        {/* Solo nombre */}
                        <div className="farm-item-main">
                            <strong>{farm.nombre}</strong>
                        </div>

                        {/* Botones editar/eliminar */}
                        <div className="farm-item-actions">
                            <button
                                type="button"
                                className="btn-link btn-link--edit"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(farm);
                                }}
                            >
                                Editar
                            </button>
                            <button
                                type="button"
                                className="btn-link btn-link--delete"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(farm.id);
                                }}
                            >
                                Eliminar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FarmList;