import { useEffect, useState } from "react";

const METODOS_SIEMBRA = [
  { value: "TRASPLANTE", label: "Trasplante" },
  { value: "SIEMBRA_DIRECTA", label: "Siembra directa" },
  { value: "VOLEO", label: "Voleo" },
];

const VARIEDADES = [
  "Fedearroz 60",
  "Fedearroz 68",
  "Fedearroz 733",
  "Fedearroz 2000",
  "Fedearroz Hc",
  "IR-42",
  "Oryzica 1",
  "Sicalis SH CL",
  "Otra",
];

const createInitialForm = () => ({
  lote: "",
  ciclo_id: "",
  fecha_siembra: "",
  variedad: "",
  variedad_personalizada: "",
  densidad_kg_ha: "",
  metodo_siembra: "",
  observaciones: "",
});

function SowingForm({ lots = [], cycles = [], onSave, loading = false }) {
  const [form, setForm] = useState(createInitialForm());
  const [errors, setErrors] = useState({});

  // Inicializar ciclo_id con el primer ciclo disponible
  useEffect(() => {
    if (cycles.length > 0 && !form.ciclo_id) {
      setForm((prev) => ({ ...prev, ciclo_id: cycles[0].id }));
    }
  }, [cycles]);

  // Resetear variedad personalizada si se cambia a una predefinida
  useEffect(() => {
    if (form.variedad !== "Otra") {
      setForm((prev) => ({ ...prev, variedad_personalizada: "" }));
    }
  }, [form.variedad]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.lote) newErrors.lote = "Selecciona un lote.";
    if (!form.fecha_siembra) newErrors.fecha_siembra = "La fecha de siembra es obligatoria.";
    if (!form.variedad) newErrors.variedad = "Selecciona o ingresa una variedad.";
    if (form.variedad === "Otra" && !form.variedad_personalizada.trim()) {
      newErrors.variedad_personalizada = "Especifica la variedad.";
    }
    if (!form.densidad_kg_ha) {
      newErrors.densidad_kg_ha = "La densidad es obligatoria.";
    } else if (Number(form.densidad_kg_ha) <= 0) {
      newErrors.densidad_kg_ha = "La densidad debe ser mayor a 0.";
    }
    if (!form.metodo_siembra) newErrors.metodo_siembra = "Selecciona un método de siembra.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const variedadFinal =
      form.variedad === "Otra" ? form.variedad_personalizada.trim() : form.variedad;

    const payload = {
      lote: Number(form.lote),
      ciclo_id: form.ciclo_id,
      fecha_siembra: form.fecha_siembra,
      variedad: variedadFinal,
      densidad_kg_ha: Number(form.densidad_kg_ha),
      metodo_siembra: form.metodo_siembra,
      observaciones: form.observaciones.trim(),
    };
    onSave(payload);
  };

  const handleReset = () => {
    setForm({ ...createInitialForm(), ciclo_id: cycles[0]?.id || "" });
    setErrors({});
  };

  return (
    <form className="form sowing-form" onSubmit={handleSubmit} noValidate>
      <div className="section-header">
        <h2>Registrar siembra</h2>
        <p>Documenta cómo y cuándo se estableció el arroz en el lote.</p>
      </div>

      <div className="form-row">
        <div className={`form-group ${errors.lote ? "form-group--error" : ""}`}>
          <label htmlFor="lote">Lote <span className="required">*</span></label>
          <select id="lote" name="lote" value={form.lote} onChange={handleChange}>
            <option value="">Selecciona un lote</option>
            {lots.map((lot) => (
              <option key={lot.id} value={lot.id}>{lot.nombre}</option>
            ))}
          </select>
          {errors.lote && <span className="field-error">{errors.lote}</span>}
        </div>

        {/* TODO (HU#3): Reemplazar por selector real de ciclos */}
        <div className="form-group">
          <label htmlFor="ciclo_id">
            Ciclo productivo
            <span className="badge-mock" title="Integración pendiente HU#3">mock</span>
          </label>
          <select id="ciclo_id" name="ciclo_id" value={form.ciclo_id} onChange={handleChange}>
            {cycles.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <span className="field-hint">⚠ Los ciclos son temporales (HU#3 pendiente).</span>
        </div>
      </div>

      <div className="form-row">
        <div className={`form-group ${errors.fecha_siembra ? "form-group--error" : ""}`}>
          <label htmlFor="fecha_siembra">Fecha de siembra <span className="required">*</span></label>
          <input
            id="fecha_siembra"
            name="fecha_siembra"
            type="date"
            value={form.fecha_siembra}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
          />
          {errors.fecha_siembra && <span className="field-error">{errors.fecha_siembra}</span>}
        </div>

        <div className={`form-group ${errors.metodo_siembra ? "form-group--error" : ""}`}>
          <label htmlFor="metodo_siembra">Método de siembra <span className="required">*</span></label>
          <select id="metodo_siembra" name="metodo_siembra" value={form.metodo_siembra} onChange={handleChange}>
            <option value="">Selecciona un método</option>
            {METODOS_SIEMBRA.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          {errors.metodo_siembra && <span className="field-error">{errors.metodo_siembra}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className={`form-group ${errors.variedad ? "form-group--error" : ""}`}>
          <label htmlFor="variedad">Variedad <span className="required">*</span></label>
          <select id="variedad" name="variedad" value={form.variedad} onChange={handleChange}>
            <option value="">Selecciona una variedad</option>
            {VARIEDADES.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          {errors.variedad && <span className="field-error">{errors.variedad}</span>}
        </div>

        <div className={`form-group ${errors.densidad_kg_ha ? "form-group--error" : ""}`}>
          <label htmlFor="densidad_kg_ha">Densidad (kg/ha) <span className="required">*</span></label>
          <input
            id="densidad_kg_ha"
            name="densidad_kg_ha"
            type="number"
            min="0.01"
            step="0.01"
            value={form.densidad_kg_ha}
            onChange={handleChange}
            placeholder="Ej: 150"
          />
          {errors.densidad_kg_ha && <span className="field-error">{errors.densidad_kg_ha}</span>}
        </div>
      </div>

      {form.variedad === "Otra" && (
        <div className={`form-group ${errors.variedad_personalizada ? "form-group--error" : ""}`}>
          <label htmlFor="variedad_personalizada">Especifica la variedad <span className="required">*</span></label>
          <input
            id="variedad_personalizada"
            name="variedad_personalizada"
            type="text"
            value={form.variedad_personalizada}
            onChange={handleChange}
            placeholder="Nombre de la variedad"
          />
          {errors.variedad_personalizada && <span className="field-error">{errors.variedad_personalizada}</span>}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="observaciones">Observaciones</label>
        <textarea
          id="observaciones"
          name="observaciones"
          rows={3}
          value={form.observaciones}
          onChange={handleChange}
          placeholder="Notas sobre condiciones de siembra, preparación del suelo, etc."
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={handleReset} disabled={loading}>
          Limpiar
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Guardando…" : "Registrar siembra"}
        </button>
      </div>
    </form>
  );
}

export default SowingForm;