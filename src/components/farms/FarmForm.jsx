import { useEffect, useState } from "react";

const initialForm = {
    nombre: "",
    ubicacion: "",
    caracteristicas: "",
};

function FarmForm({ onSave, editingFarm, onCancelEdit }) {
    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        if (editingFarm) {
            setForm({
                nombre: editingFarm.nombre ?? "",
                ubicacion: editingFarm.ubicacion ?? "",
                caracteristicas: editingFarm.caracteristicas ?? "",
            });
        } else {
            setForm(initialForm);
        }
    }, [editingFarm]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onSave({
            nombre: form.nombre.trim(),
            ubicacion: form.ubicacion.trim(),
            caracteristicas: form.caracteristicas.trim(),
        });

        if (!editingFarm) {
            setForm(initialForm);
        }
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <div className="section-header">
                <h2>{editingFarm ? "Editar finca" : "Registrar nueva finca"}</h2>
                <p>Agrega nombre, ubicación y características principales.</p>
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

            <div className="form-group">
                <label htmlFor="ubicacion">Ubicación</label>
                <input
                    id="ubicacion"
                    name="ubicacion"
                    type="text"
                    value={form.ubicacion}
                    onChange={handleChange}
                    placeholder="Ej: Vereda El Descanso"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="caracteristicas">Características</label>
                <textarea
                    id="caracteristicas"
                    name="caracteristicas"
                    rows={3}
                    value={form.caracteristicas}
                    onChange={handleChange}
                    placeholder="Describe tamaño, acceso, riego, relieve..."
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