function FarmList({ farms = [], selectedFarmId, onSelect }) {
    if (farms.length === 0) {
        return (
            <div>
                <div className="section-header">
                    <h2>Fincas registradas</h2>
                    <p>Selecciona una finca para gestionar sus lotes.</p>
                </div>

                <div className="empty-box">
                    No hay fincas registradas todavía.
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="section-header">
                <h2>Fincas registradas</h2>
                <p>Selecciona una finca para gestionar sus lotes.</p>
            </div>

            <div className="farm-list">
                {farms.map((farm) => (
                    <button
                        key={farm.id}
                        type="button"
                        className={
                            farm.id === selectedFarmId
                                ? "farm-item farm-item--active"
                                : "farm-item"
                        }
                        onClick={() => onSelect(farm.id)}
                    >
                        <h3>{farm.nombre}</h3>
                        <p>{farm.ubicacion}</p>
                        <span>{farm.caracteristicas}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default FarmList;