import { useEffect, useState } from "react";

const createInitialForm = (farmId) => ({
    fincaId: farmId || "",
    nombre: "",
    area: "",
    tipo_suelo: "Franco-arcilloso",
    estado: "DISPONIBLE",
    latitud: "",
    longitud: "",
    observaciones: "",
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
                nombre: editingLot.nombre || "",
                area: editingLot.area ?? "",
                tipo_suelo: editingLot.tipo_suelo || "Franco-arcilloso",
                estado: editingLot.estado || "DISPONIBLE",
                latitud:
                    editingLot.latitud === null || editingLot.latitud === undefined
                        ? ""
                        : editingLot.latitud,
                longitud:
                    editingLot.longitud === null || editingLot.longitud === undefined
                        ? ""
                        : editingLot.longitud,
                observaciones: editingLot.observaciones || "",
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

        const payload = {
            finca: Number(form.fincaId),
            nombre: form.nombre,
            area: Number(form.area),
            tipo_suelo: form.tipo_suelo,
            estado: form.estado,
            latitud: form.latitud === "" ? null : Number(form.latitud),
            longitud: form.longitud === "" ? null : Number(form.longitud),
            observaciones: form.observaciones ?? "",
        };

        onSave(payload);

        if (!editingLot) {
            setForm(createInitialForm(currentFarmId));
        }
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <div className="section-header">
                <h2>{editingLot ? "Editar lote" : "Registrar nuevo lote"}</h2>
                <p>Registra los datos completos del lote asociado a la finca.</p>
            </div>

            {/* Fila: finca y nombre */}
            <div className="form-row">
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
                    <label htmlFor="nombre">Nombre del lote</label>
                    <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        value={form.nombre}
                        onChange={handleChange}
                        placeholder="Ej: Bloque B, Sector Norte..."
                        required
                    />
                </div>
            </div>

            {/* Fila: área y tipo de suelo */}
            <div className="form-row">
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
                    <label htmlFor="tipo_suelo">Tipo de suelo</label>
                    <select
                        id="tipo_suelo"
                        name="tipo_suelo"
                        value={form.tipo_suelo}
                        onChange={handleChange}
                    >
                        <option value="Franco-arcilloso">Franco-arcilloso</option>
                        <option value="Arcilloso">Arcilloso</option>
                        <option value="Franco-arenoso">Franco-arenoso</option>
                        <option value="Arenoso">Arenoso</option>
                    </select>
                </div>
            </div>

            {/* Fila: estado */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="estado">Estado del lote</label>
                    <select
                        id="estado"
                        name="estado"
                        value={form.estado}
                        onChange={handleChange}
                    >
                        <option value="DISPONIBLE">Disponible</option>
                        <option value="EN_USO">En uso</option>
                        <option value="EN_PREPARACION">En preparación</option>
                        <option value="INACTIVO">Inactivo</option>
                    </select>
                </div>

                <div className="form-group">
                    {/* espacio libre por si luego agregas otro campo */}
                </div>
            </div>

            {/* Fila: coordenadas */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="latitud">Latitud</label>
                    <input
                        id="latitud"
                        name="latitud"
                        type="number"
                        step="0.000001"
                        value={form.latitud}
                        onChange={handleChange}
                        placeholder="Opcional"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="longitud">Longitud</label>
                    <input
                        id="longitud"
                        name="longitud"
                        type="number"
                        step="0.000001"
                        value={form.longitud}
                        onChange={handleChange}
                        placeholder="Opcional"
                    />
                </div>
            </div>

            {/* Observaciones */}
            <div className="form-group">
                <label htmlFor="observaciones">Observaciones</label>
                <textarea
                    id="observaciones"
                    name="observaciones"
                    rows={3}
                    value={form.observaciones}
                    onChange={handleChange}
                    placeholder="Notas adicionales sobre el lote (accesos, riego, etc.)"
                />
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