import { useEffect, useState } from "react";

const createInitialForm = (farmId) => ({
    fincaId: farmId || "",
    area: "",
    ubicacion: "",
    tipoSuelo: "Franco-arcilloso",
    estado: "Activo",
});

function LotForm({
                     farms = [],
                     currentFarmId,
                     editingLot,
                     onSave,
                     onCancelEdit,
                 }) {
    const [form, setForm] = useState(createInitialForm(currentFarmId));

    useEffect(() => {
        if (editingLot) {
            setForm({
                fincaId: editingLot.finca || editingLot.fincaId || "",
                area: editingLot.area || "",
                ubicacion: editingLot.ubicacion || "",
                tipoSuelo: editingLot.tipoSuelo || "Franco-arcilloso",
                estado: editingLot.estado || "Activo",
            });
        } else {
            setForm(createInitialForm(currentFarmId));
        }
    }, [editingLot, currentFarmId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "fincaId" ? Number(value) : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.fincaId) return;

        onSave({
            ...form,
            fincaId: Number(form.fincaId),
        });

        if (!editingLot) {
            setForm(createInitialForm(currentFarmId));
        }
    };

    return (
        <form className="lot-form" onSubmit={handleSubmit}>
            <div className="section-header">
                <h2>{editingLot ? "Editar lote" : "Registrar nuevo lote"}</h2>
                <p>Registra área, ubicación, tipo de suelo y estado.</p>
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="fincaId">Finca</label>
                    <select
                        id="fincaId"
                        name="fincaId"
                        value={form.fincaId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona una finca</option>
                        {farms.map((farm) => (
                            <option key={farm.id} value={farm.id}>
                                {farm.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="area">Área (ha)</label>
                    <input
                        id="area"
                        name="area"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.area}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="ubicacion">Ubicación dentro de la finca</label>
                    <input
                        id="ubicacion"
                        name="ubicacion"
                        type="text"
                        value={form.ubicacion}
                        onChange={handleChange}
                        placeholder="Ej: Sector Norte, Bloque A..."
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="tipoSuelo">Tipo de suelo</label>
                    <select
                        id="tipoSuelo"
                        name="tipoSuelo"
                        value={form.tipoSuelo}
                        onChange={handleChange}
                    >
                        <option value="Franco-arcilloso">Franco-arcilloso</option>
                        <option value="Arcilloso">Arcilloso</option>
                        <option value="Franco-arenoso">Franco-arenoso</option>
                        <option value="Arenoso">Arenoso</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="estado">Estado del lote</label>
                    <select
                        id="estado"
                        name="estado"
                        value={form.estado}
                        onChange={handleChange}
                    >
                        <option value="Activo">Activo</option>
                        <option value="En preparación">En preparación</option>
                        <option value="Cosechado">Cosechado</option>
                    </select>
                </div>
            </div>

            <div className="form-actions">
                {editingLot && (
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onCancelEdit}
                    >
                        Cancelar edición
                    </button>
                )}
                <button type="submit" className="btn btn-primary">
                    {editingLot ? "Guardar cambios" : "Registrar lote"}
                </button>
            </div>
        </form>
    );
}

export default LotForm;