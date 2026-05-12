import { useEffect, useState } from "react";

const ESTADOS = [
  { value: "PLANIFICADO", label: "Planificado" },
  { value: "ACTIVO", label: "Activo" },
  { value: "CERRADO", label: "Cerrado" },
];

const VARIEDADES = [
  { value: "", label: "Selecciona una variedad" },
  { value: "IR42", label: "IR42" },
  { value: "FEDEARROZ_50", label: "Fedearroz 50" },
  { value: "FEDEARROZ_67", label: "Fedearroz 67" },
  { value: "FEDEARROZ_174", label: "Fedearroz 174" },
  { value: "OTRA", label: "Otra" },
];

function CycleForm({ lots, editingCycle, onSave, onCancelEdit }) {
  const [form, setForm] = useState({
    lote: "",
    nombre: "",
    variedad_planificada: "",
    fecha_inicio_estimada: "",
    estado: "PLANIFICADO",
    observaciones: "",
  });

  useEffect(() => {
    if (editingCycle) {
      setForm({
        lote: editingCycle.lote ?? editingCycle.lote_id ?? "",
        nombre: editingCycle.nombre ?? "",
        variedad_planificada: editingCycle.variedad_planificada ?? "",
        fecha_inicio_estimada: editingCycle.fecha_inicio_estimada ?? "",
        estado: editingCycle.estado ?? "PLANIFICADO",
        observaciones: editingCycle.observaciones ?? "",
      });
    } else {
      setForm({
        lote: "",
        nombre: "",
        variedad_planificada: "",
        fecha_inicio_estimada: "",
        estado: "PLANIFICADO",
        observaciones: "",
      });
    }
  }, [editingCycle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.lote || !form.nombre || !form.fecha_inicio_estimada) {
      alert("Lote, nombre y fecha de inicio son obligatorios.");
      return;
    }

    // ── Fix: normalizar tipos antes de enviar ─────────────────────────────
    const payload = {
      lote: parseInt(form.lote, 10),
      nombre: form.nombre.trim(),
      variedad_planificada: form.variedad_planificada || null,
      // type="date" ya devuelve YYYY-MM-DD, pero lo garantizamos aquí mismo
      fecha_inicio_estimada: form.fecha_inicio_estimada,
      estado: form.estado,
      observaciones: form.observaciones || "",
    };

    console.log("FORM fecha_inicio_estimada raw:", form.fecha_inicio_estimada);
    console.log("PAYLOAD enviado a onSave:", JSON.stringify(payload));

    onSave(payload);  // ← enviamos el payload normalizado, no `form` crudo
  };

  return (
    <form className="sw-form" onSubmit={handleSubmit}>
      <div className="section-header">
        <h2>{editingCycle ? "Editar ciclo" : "Nuevo ciclo"}</h2>
        <p>Define el ciclo productivo asociado a un lote y su estado actual.</p>
      </div>

      <div className="sw-form-grid">
        <div className="form-field">
          <label htmlFor="lote">Lote</label>
          <select
            id="lote"
            name="lote"
            value={form.lote}
            onChange={handleChange}
          >
            <option value="">Selecciona un lote</option>
            {lots.map((lot) => (
              <option key={lot.id} value={lot.id}>
                {lot.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="nombre">Nombre del ciclo</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej. Ciclo 2025-A"
          />
        </div>

        <div className="form-field">
          <label htmlFor="variedad_planificada">Variedad planificada</label>
          <select
            id="variedad_planificada"
            name="variedad_planificada"
            value={form.variedad_planificada}
            onChange={handleChange}
          >
            {VARIEDADES.map((v) => (
              <option key={v.value || "none"} value={v.value}>
                {v.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="fecha_inicio_estimada">Fecha de inicio estimada</label>
          <input
            id="fecha_inicio_estimada"
            name="fecha_inicio_estimada"
            type="date"
            value={form.fecha_inicio_estimada}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            name="estado"
            value={form.estado}
            onChange={handleChange}
          >
            {ESTADOS.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field form-field--full">
          <label htmlFor="observaciones">Observaciones</label>
          <textarea
            id="observaciones"
            name="observaciones"
            rows={3}
            value={form.observaciones}
            onChange={handleChange}
            placeholder="Notas relevantes del ciclo..."
          />
        </div>
      </div>

      <div className="form-actions">
        {editingCycle && (
          <button type="button" className="btn-secondary" onClick={onCancelEdit}>
            Cancelar edición
          </button>
        )}
        <button type="submit" className="btn-primary">
          {editingCycle ? "Guardar cambios" : "Crear ciclo"}
        </button>
      </div>
    </form>
  );
}

export default CycleForm;