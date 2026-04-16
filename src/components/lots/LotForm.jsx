import { useEffect, useState } from "react";

const createInitialForm = (farmId) => ({
    fincaId: farmId || "",
    area: "",
    ubicacion: "",
    tipoSuelo: "Franco-arcilloso",
    estado: "Activo",
});

function LotForm({ farms = [], currentFarmId, editingLot, onSave, onCancelEdit }) {
    const [form, setForm] = useState(createInitialForm(currentFarmId));

    useEffect(() => {
        if (editingLot) {
            setForm({
                fincaId: editingLot.fincaId || "",
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
        <div>
            <div className="section-header">
                <h2>{editingLot ? "Actualizar lote" : "Registrar lote"}</h2>
                <p>Registra área, ubicación, tipo de suelo y estado.</p>
            </div>

            {farms.length === 0 ? (
                <div className="empty-box">
                    Debes registrar una finca antes de crear lotes.
                </div>
            ) : (
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Finca asociada</label>
                        <select
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

                    <div className="form-row">
                        <div className="form-group">
                            <label>Área (ha)</label>
                            <input
                                type="number"
                                step="0.1"
                                name="area"
                                value={form.area}
                                onChange={handleChange}
                                placeholder="Ej: 2.5"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Ubicación del lote</label>
                            <input
                                type="text"
                                name="ubicacion"
                                value={form.ubicacion}
                                onChange={handleChange}
                                placeholder="Ej: Sector Norte"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Tipo de suelo</label>
                            <select
                                name="tipoSuelo"
                                value={form.tipoSuelo}
                                onChange={handleChange}
                            >
                                <option>Franco-arcilloso</option>
                                <option>Arcilloso</option>
                                <option>Franco-arenoso</option>
                                <option>Limoso</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Estado</label>
                            <select
                                name="estado"
                                value={form.estado}
                                onChange={handleChange}
                            >
                                <option>Activo</option>
                                <option>En preparación</option>
                                <option>Cosechado</option>
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
                                Cancelar
                            </button>
                        )}

                        <button type="submit" className="btn btn-primary">
                            {editingLot ? "Guardar cambios" : "Registrar lote"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default LotForm;