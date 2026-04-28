import { useEffect, useState } from "react";

const initialForm = {
    nombre: "",
    departamento: "",
    municipio: "",
    vereda: "",
    area_total: "",
    tipo_suelo: "",
    observaciones: "",
};

function FarmForm({ onSave, editingFarm, onCancelEdit }) {
    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        if (editingFarm) {
            setForm({
                nombre: editingFarm.nombre ?? "",
                departamento: editingFarm.departamento ?? "",
                municipio: editingFarm.municipio ?? "",
                vereda: editingFarm.vereda ?? "",
                area_total:
                    editingFarm.area_total ??
                    editingFarm.areatotal ??
                    "",
                tipo_suelo:
                    editingFarm.tipo_suelo ??
                    editingFarm.tiposuelo ??
                    "",
                observaciones: editingFarm.observaciones ?? "",
            });
        } else {
            setForm(initialForm);
        }
    }, [editingFarm]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onSave({
            nombre: form.nombre.trim(),
            departamento: form.departamento.trim(),
            municipio: form.municipio.trim(),
            vereda: form.vereda.trim(),
            area_total: Number(form.area_total),
            tipo_suelo: form.tipo_suelo.trim(),
            observaciones: form.observaciones.trim(),
        });

        if (!editingFarm) {
            setForm(initialForm);
        }
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <div className="section-header">
                <h2>{editingFarm ? "Editar finca" : "Registrar nueva finca"}</h2>
                <p>Completa los datos generales de la finca.</p>
            </div>

            <div className="form-group">
                <label htmlFor="nombre">Nombre de la finca</label>
                <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="departamento">Departamento</label>
                    <input
                        id="departamento"
                        name="departamento"
                        type="text"
                        value={form.departamento}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="municipio">Municipio</label>
                    <input
                        id="municipio"
                        name="municipio"
                        type="text"
                        value={form.municipio}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="vereda">Vereda</label>
                    <input
                        id="vereda"
                        name="vereda"
                        type="text"
                        value={form.vereda}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="area_total">Área total</label>
                    <input
                        id="area_total"
                        name="area_total"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={form.area_total}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="tipo_suelo">Tipo de suelo</label>
                <input
                    id="tipo_suelo"
                    name="tipo_suelo"
                    type="text"
                    value={form.tipo_suelo}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="observaciones">Observaciones</label>
                <textarea
                    id="observaciones"
                    name="observaciones"
                    rows={3}
                    value={form.observaciones}
                    onChange={handleChange}
                />
            </div>

            <div className="form-actions">
                {editingFarm && (
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onCancelEdit}
                    >
                        Cancelar edición
                    </button>
                )}

                <button type="submit" className="btn btn-primary">
                    {editingFarm ? "Guardar cambios" : "Registrar finca"}
                </button>
            </div>
        </form>
    );
}

export default FarmForm;