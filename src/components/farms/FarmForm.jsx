import { useEffect, useState } from "react";

const initialForm = {
    nombre: "",
    departamento: "",
    municipio: "",
    vereda: "",
    areatotal: "",
    tiposuelo: "",
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
                areatotal:
                    editingFarm.areatotal === null || editingFarm.areatotal === undefined
                        ? ""
                        : editingFarm.areatotal,
                tiposuelo: editingFarm.tiposuelo ?? "",
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
            [name]: name === "areatotal" ? value : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onSave({
            nombre: form.nombre.trim(),
            departamento: form.departamento.trim(),
            municipio: form.municipio.trim(),
            vereda: form.vereda.trim(),
            areatotal: Number(form.areatotal),
            tiposuelo: form.tiposuelo.trim(),
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
                    placeholder="Ej: Finca El Porvenir"
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
                        placeholder="Ej: Norte de Santander"
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
                        placeholder="Ej: Cúcuta"
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
                        placeholder="Ej: Vereda El Descanso"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="areatotal">Área total (ha)</label>
                    <input
                        id="areatotal"
                        name="areatotal"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={form.areatotal}
                        onChange={handleChange}
                        placeholder="Ej: 12.5"
                        required
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="tiposuelo">Tipo de suelo</label>
                <input
                    id="tiposuelo"
                    name="tiposuelo"
                    type="text"
                    value={form.tiposuelo}
                    onChange={handleChange}
                    placeholder="Ej: Franco-arcilloso"
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
                    placeholder="Notas adicionales sobre la finca"
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