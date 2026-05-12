import { useEffect, useState } from "react";
import { API } from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import CycleForm from "../../components/cycles/CycleForm";
import CycleTable from "../../components/cycles/CycleTable";
import PlanificacionForm from "../../components/cycles/PlanificacionForm";
import "../../styles/sowing.css";

function toISODate(val) {
  if (!val) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  const d = new Date(val);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(fecha) {
  if (!fecha) return "—";
  if (/^\d{4}-\d{4}-\d{2}$/.test(fecha)) {
    const [y, m, d] = fecha.split("-");
    return `${d}/${m}/${y}`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    const [y, m, d] = fecha.split("-");
    return `${d}/${m}/${y}`;
  }
  return fecha;
}

function CyclesPage() {
  const { authFetch, loading, isAuthenticated } = useAuth();

  const [ciclos, setCiclos] = useState([]);
  const [planificaciones, setPlanificaciones] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [lots, setLots] = useState([]);
  const [editingCycle, setEditingCycle] = useState(null);
  const [error, setError] = useState(null);

  // ─── Carga de datos ───────────────────────────────────────────────────────
  const loadData = async () => {
    try {
      setError(null);

      const [resCiclos, resPlan, resHist, resLotes] = await Promise.all([
        authFetch(`${API.ciclos}/`),
        authFetch(`${API.planificaciones}/`),
        authFetch(`${API.historialCiclos}/`),
        authFetch(`${API.lotes}/`),
      ]);

      if (!resCiclos.ok || !resPlan.ok || !resHist.ok || !resLotes.ok) {
        console.error(
          "Error al cargar datos:",
          resCiclos.status,
          resPlan.status,
          resHist.status,
          resLotes.status
        );
        setError("Error al cargar datos de ciclos.");
        return;
      }

      const dataCiclos = await resCiclos.json();
      const dataPlan   = await resPlan.json();
      const dataHist   = await resHist.json();
      const dataLotes  = await resLotes.json();

      setCiclos(Array.isArray(dataCiclos) ? dataCiclos : dataCiclos.results ?? []);
      setPlanificaciones(Array.isArray(dataPlan) ? dataPlan : dataPlan.results ?? []);
      setHistorial(Array.isArray(dataHist) ? dataHist : dataHist.results ?? []);
      setLots(Array.isArray(dataLotes) ? dataLotes : dataLotes.results ?? []);
    } catch (err) {
      console.error("Error de red al cargar ciclos:", err);
      setError("Error de red al cargar ciclos.");
    }
  };

  useEffect(() => {
    if (loading || !isAuthenticated) return;
    loadData();
  }, [loading, isAuthenticated]);

  // ─── Guardar ciclo (crear / editar) ───────────────────────────────────────
  const handleSaveCycle = async (cycleData) => {
    const payload = {
      ...cycleData,
      lote: parseInt(cycleData.lote, 10),
      fecha_inicio_estimada: toISODate(cycleData.fecha_inicio_estimada),
      area_sembrada: cycleData.area_sembrada
        ? parseFloat(cycleData.area_sembrada)
        : null,
    };

    try {
      if (editingCycle) {
        const res = await authFetch(`${API.ciclos}/${editingCycle.id}/`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          console.error("Error al editar ciclo:", res.status, errorData);
          alert(
            errorData?.fecha_inicio_estimada?.[0] ||
            errorData?.lote?.[0] ||
            errorData?.detail ||
            "No se pudo editar el ciclo."
          );
          return;
        }

        const updated = await res.json();
        setCiclos((prev) =>
          prev.map((c) => (c.id === editingCycle.id ? updated : c))
        );
        setEditingCycle(null);
        await loadData();
      } else {
        const res = await authFetch(`${API.ciclos}/`, {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          console.error("Error al crear ciclo:", res.status, errorData);
          alert(
            errorData?.fecha_inicio_estimada?.[0] ||
            errorData?.lote?.[0] ||
            errorData?.detail ||
            "No se pudo crear el ciclo."
          );
          return;
        }

        const created = await res.json();
        setCiclos((prev) => [...prev, created]);
        await loadData();
      }
    } catch (err) {
      console.error("Error de red al guardar ciclo:", err);
      alert("Error de red al guardar ciclo.");
    }
  };

  // ─── Guardar planificación ────────────────────────────────────────────────
  const handleSavePlanificacion = async (planData) => {
    try {
      const res = await authFetch(`${API.planificaciones}/`, {
        method: "POST",
        body: JSON.stringify(planData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error("Error al crear planificación:", res.status, errorData);
        alert(
          errorData?.non_field_errors?.[0] ||
          errorData?.ciclo?.[0] ||
          errorData?.detail ||
          "No se pudo guardar la planificación."
        );
        return;
      }

      await loadData();
      alert("Planificación creada correctamente.");
    } catch (err) {
      console.error("Error de red al crear planificación:", err);
      alert("Error de red al guardar la planificación.");
    }
  };

  // ─── Editar ciclo ─────────────────────────────────────────────────────────
  const handleEditCycle = (ciclo) => {
    setEditingCycle(ciclo);
  };

  // ─── Eliminar ciclo ───────────────────────────────────────────────────────
  const handleDeleteCycle = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este ciclo?")) return;

    try {
      const res = await authFetch(`${API.ciclos}/${id}/`, { method: "DELETE" });

      if (!res.ok) {
        console.error("Error al eliminar ciclo:", res.status);
        alert("No se pudo eliminar el ciclo.");
        return;
      }

      setCiclos((prev) => prev.filter((c) => c.id !== id));
      await loadData();
    } catch (err) {
      console.error("Error de red al eliminar ciclo:", err);
      alert("Error de red al eliminar ciclo.");
    }
  };

  if (loading) {
    return <div style={{ padding: "40px" }}>Cargando información de ciclos...</div>;
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="sw-page">
      <header className="sw-hero">
        <div className="sw-hero__content">
          <span className="sw-eyebrow">Gestión agrícola</span>
          <h1>Ciclos productivos</h1>
          <p>
            Visualiza y gestiona los ciclos de siembra asociados a los lotes, sus
            planificaciones e historial de estados.
          </p>
        </div>
      </header>

      {error && <div className="error-box">{error}</div>}

      <section className="sw-layout">
        {/* ── Columna izquierda: formularios ── */}
        <div className="sw-column">
          <CycleForm
            lots={lots}
            editingCycle={editingCycle}
            onSave={handleSaveCycle}
            onCancelEdit={() => setEditingCycle(null)}
          />

          <div className="sw-card" style={{ marginTop: "1.5rem" }}>
            <PlanificacionForm
              ciclos={ciclos}
              planificaciones={planificaciones}
              onSave={handleSavePlanificacion}
            />
          </div>
        </div>

        {/* ── Columna derecha: planificaciones e historial ── */}
        <div className="sw-column">
          <div className="sw-card">
            <h2>Planificaciones</h2>

            {planificaciones.length === 0 ? (
              <p>No hay planificaciones.</p>
            ) : (
              <div className="cycles-list">
                {planificaciones.map((plan) => (
                  <div key={plan.id} className="cycles-mini-card">
                    <h3>{plan.ciclo_nombre ?? `Ciclo #${plan.ciclo}`}</h3>
                    <p><strong>Preparación estimada:</strong> {formatDate(plan.fecha_preparacion_estimada)}</p>
                    <p><strong>Siembra estimada:</strong> {formatDate(plan.fecha_siembra_estimada)}</p>
                    <p><strong>Manejo estimado:</strong> {formatDate(plan.fecha_manejo_estimada)}</p>
                    <p><strong>Cosecha estimada:</strong> {formatDate(plan.fecha_cosecha_estimada)}</p>
                    <p><strong>Preparación real:</strong> {formatDate(plan.fecha_preparacion_real)}</p>
                    <p><strong>Siembra real:</strong> {formatDate(plan.fecha_siembra_real)}</p>
                    <p><strong>Cosecha real:</strong> {formatDate(plan.fecha_cosecha_real)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="sw-card">
            <h2>Historial de ciclos</h2>

            {historial.length === 0 ? (
              <p>No hay registros en el historial.</p>
            ) : (
              <div className="cycles-list">
                {historial.map((item) => (
                  <div key={item.id} className="cycles-mini-card">
                    <h3>{item.ciclo_nombre ?? `Ciclo #${item.ciclo}`}</h3>
                    <p>
                      <strong>Cambio:</strong>{" "}
                      {item.estado_anterior || "—"} → {item.estado_nuevo}
                    </p>
                    <p><strong>Fecha:</strong> {formatDate(item.fecha_cambio)}</p>
                    <p><strong>Observación:</strong> {item.observacion || "—"}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="sw-card sw-card--table">
        <CycleTable
          ciclos={ciclos}
          lots={lots}
          onEdit={handleEditCycle}
          onDelete={handleDeleteCycle}
        />
      </section>
    </div>
  );
}

export default CyclesPage;