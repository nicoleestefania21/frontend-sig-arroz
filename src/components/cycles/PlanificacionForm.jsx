import { useEffect, useMemo, useState } from "react";

function PlanificacionForm({ ciclos, planificaciones, onSave }) {
  const [form, setForm] = useState({
    ciclo: "",
    fecha_preparacion_estimada: "",
    fecha_siembra_estimada: "",
    fecha_manejo_estimada: "",
    fecha_cosecha_estimada: "",
  });

  const ciclosDisponibles = useMemo(() => {
    const ciclosConPlan = new Set(
      planificaciones.map((p) => Number(p.ciclo))
    );
    return ciclos.filter((c) => !ciclosConPlan.has(Number(c.id)));
  }, [ciclos, planificaciones]);

  useEffect(() => {
    if (!form.ciclo && ciclosDisponibles.length > 0) {
      setForm((prev) => ({ ...prev, ciclo: String(ciclosDisponibles[0].id) }));
    }
  }, [ciclosDisponibles, form.ciclo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.ciclo ||
      !form.fecha_preparacion_estimada ||
      !form.fecha_siembra_estimada ||
      !form.fecha_manejo_estimada ||
      !form.fecha_cosecha_estimada
    ) {
      alert("Debes completar todas las fechas estimadas.");
      return;
    }

    onSave({
      ...form,
      ciclo: parseInt(form.ciclo, 10),
    });
  };

  return (
    <form className="sw-form" onSubmit={handleSubmit}>
      <div className="section-header">
        <h2>Nueva planificación</h2>
        <p>Define las fechas clave estimadas del ciclo productivo.</p>
      </div>

      {ciclosDisponibles.length === 0 ? (
        <p>No hay ciclos disponibles sin planificación.</p>
      ) : (
        <>
          <div className="sw-form-grid">
            <div className="form-field form-field--full">
              <label htmlFor="ciclo">Ciclo</label>
              <select
                id="ciclo"
                name="ciclo"
                value={form.ciclo}
                onChange={handleChange}
              >
                {ciclosDisponibles.map((ciclo) => (
                  <option key={ciclo.id} value={ciclo.id}>
                    {ciclo.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="fecha_preparacion_estimada">
                Preparación estimada
              </label>
              <input
                type="date"
                id="fecha_preparacion_estimada"
                name="fecha_preparacion_estimada"
                value={form.fecha_preparacion_estimada}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="fecha_siembra_estimada">
                Siembra estimada
              </label>
              <input
                type="date"
                id="fecha_siembra_estimada"
                name="fecha_siembra_estimada"
                value={form.fecha_siembra_estimada}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="fecha_manejo_estimada">
                Manejo estimado
              </label>
              <input
                type="date"
                id="fecha_manejo_estimada"
                name="fecha_manejo_estimada"
                value={form.fecha_manejo_estimada}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="fecha_cosecha_estimada">
                Cosecha estimada
              </label>
              <input
                type="date"
                id="fecha_cosecha_estimada"
                name="fecha_cosecha_estimada"
                value={form.fecha_cosecha_estimada}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Guardar planificación
            </button>
          </div>
        </>
      )}
    </form>
  );
}

export default PlanificacionForm;