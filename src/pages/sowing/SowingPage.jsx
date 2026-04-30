import { useEffect, useMemo, useRef, useState } from "react";
import SowingForm from "../../components/sowing/SowingForm";
import SowingTable from "../../components/sowing/SowingTable";
import { useAuth } from "../../context/AuthContext";
import "../../styles/sowing.css";

// ── MOCK CICLOS (HU#3 pendiente) ─────────────────────────────
// TODO (HU#3): Reemplazar por GET /api/ciclos/?lote=<id>
// Los campos fecha_inicio / fecha_fin son los que el backend
// deberá proveer; la lógica de isSowingActive ya los consume.
const MOCK_CICLOS = [
  {
    id: "CICLO-MOCK-001",
    label: "Ciclo A 2025 (mock)",
    fecha_inicio: "2025-01-01",
    fecha_fin: "2025-06-30",
  },
  {
    id: "CICLO-MOCK-002",
    label: "Ciclo B 2025 (mock)",
    fecha_inicio: "2025-07-01",
    fecha_fin: "2025-12-31",
  },
];

/**
 * Determina si una siembra está activa basándose en las fechas
 * del ciclo agrícola al que pertenece.
 *
 * Una siembra se considera activa cuando la fecha de hoy cae
 * dentro del rango [fecha_inicio, fecha_fin] de su ciclo.
 *
 * Jerarquía de evaluación:
 *  1. Si el ciclo tiene fechas → usa comparación de fechas (fuente de verdad).
 *  2. Si no hay fechas en el ciclo → cae al campo `estado` del backend
 *     como respaldo para retrocompatibilidad.
 *  3. Si no hay ninguna de las dos → se considera inactiva.
 *
 * @param {Object} sowing  - Objeto de siembra; debe tener `ciclo_id`.
 * @param {Array}  cycles  - Lista de ciclos; cada uno puede tener
 *                           `fecha_inicio` y `fecha_fin` (ISO strings).
 * @returns {boolean}
 */
function isSowingActive(sowing, cycles) {
  const cycle = cycles.find((c) => c.id === sowing.ciclo_id);

  if (cycle?.fecha_inicio && cycle?.fecha_fin) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // comparar solo por fecha, sin hora
    const start = new Date(cycle.fecha_inicio);
    const end = new Date(cycle.fecha_fin);
    return today >= start && today <= end;
  }

  // Respaldo: campo `estado` que proviene del backend cuando el
  // ciclo aún no expone fechas (compatibilidad con HU#3 parcial).
  if (sowing.estado !== undefined) {
    return sowing.estado === "ACTIVO";
  }

  return false;
}

function SowingPage() {
  const { authFetch } = useAuth();
  const [lots, setLots] = useState([]);
  const [sowings, setSowings] = useState([]);
  // `cycles` arranca con los mocks; se reemplazará con la respuesta
  // real cuando HU#3 esté lista (ver TODO más abajo).
  const [cycles, setCycles] = useState(MOCK_CICLOS);
  const [loadingLots, setLoadingLots] = useState(true);
  const [savingForm, setSavingForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const nextId = useRef(1);

  // ── CARGA DE LOTES (con token de autenticación) ───────────
  useEffect(() => {
    async function loadLots() {
      try {
        const res = await authFetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/lotes/`
        );
        if (res.ok) {
          const data = await res.json();
          setLots(data);
        }
      } catch (err) {
        console.warn("Error cargando lotes:", err.message);
      } finally {
        setLoadingLots(false);
      }
    }
    loadLots();
  }, []);

  // ── CARGA DE CICLOS ───────────────────────────────────────
  // TODO (HU#3): Descomentar cuando el endpoint esté disponible.
  // El backend debe devolver objetos con al menos:
  //   { id, label, fecha_inicio: "YYYY-MM-DD", fecha_fin: "YYYY-MM-DD" }
  //
  // useEffect(() => {
  //   async function loadCycles() {
  //     try {
  //       const res = await authFetch(
  //         `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/ciclos/`
  //       );
  //       if (res.ok) {
  //         const data = await res.json();
  //         setCycles(data); // reemplaza los mocks automáticamente
  //       }
  //     } catch (err) {
  //       console.warn("Error cargando ciclos:", err.message);
  //       // si falla, los MOCK_CICLOS del estado inicial siguen activos
  //     }
  //   }
  //   loadCycles();
  // }, []);

  // ── ESTADÍSTICAS ──────────────────────────────────────────
  const sowingStats = useMemo(() => {
    const activas = sowings.filter((s) => isSowingActive(s, cycles)).length;
    return {
      totalSowings: sowings.length,
      totalLots: lots.length,
      totalCycles: cycles.length,
      activeSowings: activas,
    };
  }, [sowings, lots, cycles]);

  // ── GUARDAR ───────────────────────────────────────────────
  const handleSave = async (payload) => {
    setSavingForm(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      /**
       * TODO (Backend): Reemplazar el mock por:
       *   const res = await authFetch(`${VITE_API_URL}/sowings/`, {
       *     method: "POST",
       *     body: JSON.stringify(payload),
       *   });
       *   if (!res.ok) throw new Error("Error al crear siembra");
       *   const nueva = await res.json();
       */
      const nueva = { id: nextId.current++, ...payload, creado_en: new Date().toISOString() };
      setSowings((prev) => [...prev, nueva]);
      setSuccessMsg("✓ Siembra registrada correctamente.");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Error al guardar siembra:", err);
      setErrorMsg("No se pudo guardar la siembra. Intenta de nuevo.");
    } finally {
      setSavingForm(false);
    }
  };

  // ── ELIMINAR ──────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      // TODO (Backend): await authFetch(`${VITE_API_URL}/sowings/${id}/`, { method: "DELETE" });
      setSowings((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setErrorMsg("No se pudo eliminar la siembra.");
    }
  };

  return (
    <div className="sowing-page">
      <header className="fl-hero">
        <div className="fl-hero__content">
          <span className="fl-eyebrow">Producción agrícola</span>
          <h1>Registro de siembra</h1>
          <p>
            Documenta cómo y cuándo se estableció el arroz en cada lote.
          </p>
        </div>
        <div className="fl-hero__chips">
          <span className="fl-chip">Módulo operativo</span>
          <span className="fl-chip fl-chip--accent">
            {sowingStats.activeSowings > 0
              ? "Ciclos activos"
              : "Sin ciclos activos"}
          </span>
        </div>
      </header>

      <section className="sowing-stats">
        <article className="sowing-stat-card">
          <span className="sowing-stat-card__label">Siembras registradas</span>
          <strong>{sowingStats.totalSowings}</strong>
          <p>Total de siembras ingresadas al sistema.</p>
        </article>

        <article className="sowing-stat-card">
          <span className="sowing-stat-card__label">Lotes disponibles</span>
          <strong>{sowingStats.totalLots}</strong>
          <p>Lotes habilitados para asociar a una siembra.</p>
        </article>

        <article className="sowing-stat-card">
          <span className="sowing-stat-card__label">Ciclos disponibles</span>
          <strong>{sowingStats.totalCycles}</strong>
          <p>Ciclos agrícolas configurados en el sistema.</p>
        </article>

        <article className="sowing-stat-card sowing-stat-card--highlight">
          <span className="sowing-stat-card__label">Siembras activas</span>
          <strong>{sowingStats.activeSowings}</strong>
          <p>
            {sowingStats.activeSowings > 0
              ? "Siembras con ciclo en curso."
              : "Sin siembras activas registradas."}
          </p>
        </article>
      </section>

      {successMsg && (
        <div className="alert alert--success" role="alert">{successMsg}</div>
      )}
      {errorMsg && (
        <div className="alert alert--error" role="alert">
          {errorMsg}
          <button className="alert__close" onClick={() => setErrorMsg("")}>×</button>
        </div>
      )}

      <section className="sowing-layout">
        <div className="sowing-column">
          <div className="fl-card fl-card--soft">
            {loadingLots ? (
              <div className="loading-box">Cargando lotes…</div>
            ) : (
              <SowingForm
                lots={lots}
                cycles={cycles}
                onSave={handleSave}
                loading={savingForm}
              />
            )}
          </div>
        </div>

        <div className="sowing-column">
          <div className="fl-card fl-card--summary">
            <div className="section-header">
              <h2>Sobre el registro</h2>
              <p>Información para completar el formulario correctamente.</p>
            </div>
            <ul className="info-list">
              <li><strong>Lote:</strong> Selecciona el lote donde se realizó la siembra.</li>
              <li><strong>Fecha:</strong> Día exacto de la siembra.</li>
              <li><strong>Variedad:</strong> Cultivar de arroz utilizado.</li>
              <li><strong>Densidad:</strong> Semilla usada por hectárea (kg/ha). Rango típico: 120–200 kg/ha.</li>
              <li>
                <strong>Método:</strong>
                <ul>
                  <li><em>Trasplante</em> — plántulas de semillero.</li>
                  <li><em>Siembra directa</em> — semilla en suelo preparado.</li>
                  <li><em>Voleo</em> — distribución al vuelo.</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="fl-card fl-card--table">
        <SowingTable sowings={sowings} lots={lots} onDelete={handleDelete} />
      </section>
    </div>
  );
}

// Fallback si el backend no responde
/*const MOCK_LOTS_FALLBACK = [
  { id: 1, nombre: "Lote A (mock)" },
  { id: 2, nombre: "Lote B (mock)" },
  { id: 3, nombre: "Lote C (mock)" },
];
 */
export default SowingPage;