import { useState } from "react";

const initialForm = {
    nombre: "",
    ubicacion: "",
    caracteristicas: "",
};

function FarmForm({ onSave }) {
    const [form, setForm] = useState(initialForm);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
        setForm(initialForm);
    };

    return (
        <div>
            <div className="section-header">
                <h2>Registrar finca</h2>
                <p>Agrega nombre, ubicación y características principales.</p>
            </div>

            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre de la finca</label>
                    <input
                        type="text"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        placeholder="Ej: Finca El Mirador"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Ubicación</label>
                    <input
                        type="text"
                        name="ubicacion"
                        value={form.ubicacion}
                        onChange={handleChange}
                        placeholder="Municipio, vereda o sector"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Características</label>
                    <textarea
                        name="caracteristicas"
                        value={form.caracteristicas}
                        onChange={handleChange}
                        placeholder="Ej: riego, acceso, tamaño, infraestructura"
                        rows="4"
                        required
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                        Registrar finca
                    </button>
                </div>
            </form>
        </div>
    );
}

export default FarmForm;