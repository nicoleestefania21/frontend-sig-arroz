import { useState } from "react";

const initialForm = {
    nombre: "",
    departamento: "",
    municipio: "",
    vereda: "",
    area_total: "",
    tipo_suelo: "",
    caracteristicas: "",
};

function FarmForm({ onSave }) {
    const [form, setForm] = useState(initialForm);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            caracteristicas: form.caracteristicas ?? "",
        };

        onSave(payload);
        setForm(initialForm);
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <div className="section-header">
                <h2>Registrar finca</h2>
                <p>Ingresa la información básica de la finca.</p>
            </div>

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

            <div className="form-row">
                <div className="form-group">
                    <label>Departamento</label>
                    <input
                        type="text"
                        name="departamento"
                        value={form.departamento}
                        onChange={handleChange}
                        placeholder="Ej: Norte de Santander"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Municipio</label>
                    <input
                        type="text"
                        name="municipio"
                        value={form.municipio}
                        onChange={handleChange}
                        placeholder="Ej: Cúcuta"
                        required
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Vereda o sector</label>
                <input
                    type="text"
                    name="vereda"
                    value={form.vereda}
                    onChange={handleChange}
                    placeholder="Ej: La Floresta"
                    required
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Área total (ha)</label>
                    <input
                        type="number"
                        name="area_total"
                        value={form.area_total}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Tipo de suelo</label>
                    <select
                        name="tipo_suelo"
                        value={form.tipo_suelo}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona una opción</option>
                        <option value="franco">Franco</option>
                        <option value="arcilloso">Arcilloso</option>
                        <option value="arenoso">Arenoso</option>
                        <option value="franco-arenoso">Franco-arenoso</option>
                        <option value="franco-arcilloso">Franco-arcilloso</option>
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label>Características de la finca</label>
                <textarea
                    name="caracteristicas"
                    value={form.caracteristicas}
                    onChange={handleChange}
                    placeholder="Ej: riego, acceso, tamaño, infraestructura"
                    rows={3}
                />
            </div>

            <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                    Registrar finca
                </button>
            </div>
        </form>
    );
}

export default FarmForm;