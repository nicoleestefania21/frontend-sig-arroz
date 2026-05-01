import { useEffect, useState } from "react";

const LABOR_OPTIONS = [
    "Arado",
    "Rastrillado",
    "Subsolado",
    "Nivelación",
    "Drenaje",
    "Adecuación general",
    "Enmienda del suelo",
    "Otro",
];

const ESTADO_TERRENO_OPTIONS = [
    "Óptimo",
    "Húmedo",
    "Seco",
    "Compactado",
    "Inundable",
    "Pendiente de adecuación",
];

const createInitialForm = (lotId) => ({
    lote: lotId ?? "",
    tipo_labor: "",
    fecha: new Date().toISOString().slice(0, 10),
    ph: "",
    humedad: "",
    nivelacion: false,
    drenaje: false,
    adecuacion: false,
    estado_terreno: "Óptimo",
    observaciones: "",
});

function TerrainLaborForm({
    lots,
    selectedLotId,
    editingLabor,
    onSave,
    onCancelEdit,
}) {
    const [form, setForm] = useState(createInitialForm(selectedLotId));

    useEffect(() => {
        if (editingLabor) {
            setForm({
                lote: editingLabor.lote ?? "",
                tipo_labor: editingLabor.tipo_labor ?? "",
                fecha: editingLabor.fecha ?? new Date().toISOString().slice(0, 10),
                ph: editingLabor.ph ?? "",
                humedad: editingLabor.humedad ?? "",
                nivelacion: !!editingLabor.nivelacion,
                drenaje: !!editingLabor.drenaje,
                adecuacion: !!editingLabor.adecuacion,
                estado_terreno: editingLabor.estado_terreno ?? "Óptimo",
                observaciones: editingLabor.observaciones ?? "",
            });
        } else {
            setForm(createInitialForm(selectedLotId));
        }
    }, [editingLabor, selectedLotId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.lote) return;

        onSave({
            ...form,
            lote: Number(form.lote),
        });

        if (!editingLabor) {
            setForm(createInitialForm(selectedLotId));
        }
    };

    return (
        <div>
            <div className="section-header">
                <h2>{editingLabor ? "Actualizar labor" : "Registrar labor de terreno"}</h2>
                <p>
                    Registra actividades del suelo, adecuaciones del terreno y condiciones
                    de preparación previas a la siembra.
                </p>
            </div>

            {!lots.length ? (
                <div className="tl-empty-box">
                    Debes seleccionar una finca con lotes disponibles para registrar una labor.
                </div>
            ) : (
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Lote</label>
                            <select
                                name="lote"
                                value={form.lote}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecciona un lote</option>
                                {lots.map((lot) => (
                                    <option key={lot.id} value={lot.id}>
                                        {lot.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Fecha</label>
                            <input
                                type="date"
                                name="fecha"
                                value={form.fecha}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Tipo de labor</label>
                            <select
                                name="tipo_labor"
                                value={form.tipo_labor}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecciona una labor</option>
                                {LABOR_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Estado del terreno</label>
                            <select
                                name="estado_terreno"
                                value={form.estado_terreno}
                                onChange={handleChange}
                                required
                            >
                                {ESTADO_TERRENO_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>pH del suelo</label>
                            <input
                                type="number"
                                name="ph"
                                min="0"
                                max="14"
                                step="0.1"
                                value={form.ph}
                                onChange={handleChange}
                                placeholder="Ej. 6.5"
                            />
                        </div>

                        <div className="form-group">
                            <label>Humedad (%)</label>
                            <input
                                type="number"
                                name="humedad"
                                min="0"
                                max="100"
                                step="0.1"
                                value={form.humedad}
                                onChange={handleChange}
                                placeholder="Ej. 42"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Acciones de adecuación</label>
                        <div className="tl-check-grid">
                            <label className="tl-check-card">
                                <input
                                    type="checkbox"
                                    name="nivelacion"
                                    checked={form.nivelacion}
                                    onChange={handleChange}
                                />
                                <span>Nivelación</span>
                            </label>

                            <label className="tl-check-card">
                                <input
                                    type="checkbox"
                                    name="drenaje"
                                    checked={form.drenaje}
                                    onChange={handleChange}
                                />
                                <span>Drenaje</span>
                            </label>

                            <label className="tl-check-card">
                                <input
                                    type="checkbox"
                                    name="adecuacion"
                                    checked={form.adecuacion}
                                    onChange={handleChange}
                                />
                                <span>Adecuación</span>
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Observaciones</label>
                        <textarea
                            name="observaciones"
                            value={form.observaciones}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Describe detalles del alistamiento, hallazgos o recomendaciones."
                        />
                    </div>

                    <div className="form-actions">
                        {editingLabor ? (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onCancelEdit}
                            >
                                Cancelar
                            </button>
                        ) : null}

                        <button type="submit" className="btn btn-primary">
                            {editingLabor ? "Guardar cambios" : "Registrar labor"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default TerrainLaborForm;