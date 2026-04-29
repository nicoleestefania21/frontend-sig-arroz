import { useMemo, useState, useEffect } from "react";
import FarmForm from "../../components/farms/FarmForm";
import FarmList from "../../components/farms/FarmList";
import LotForm from "../../components/lots/LotForm";
import LotTable from "../../components/lots/LotTable";
import "../../styles/farms-lots.css";
import { API } from "../../config/api";
import { useAuth } from "../../context/AuthContext";

function FarmsLotsPage() {
  const { authFetch, loading, isAuthenticated } = useAuth();

  const [farms, setFarms] = useState([]);
  const [lots, setLots] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [editingFarm, setEditingFarm] = useState(null);
  const [editingLot, setEditingLot] = useState(null);

  useEffect(() => {
    if (loading || !isAuthenticated) return;

    async function loadData() {
      try {
        const resFincas = await authFetch(`${API.fincas}/`);
        if (!resFincas.ok) {
          console.error("Error al cargar fincas:", resFincas.status);
          return;
        }
        const dataFincas = await resFincas.json();
        setFarms(dataFincas);

        if (dataFincas.length > 0) {
          setSelectedFarmId((prev) => prev ?? dataFincas[0].id);
        }

        const resLotes = await authFetch(`${API.lotes}/`);
        if (!resLotes.ok) {
          console.error("Error al cargar lotes:", resLotes.status);
          return;
        }
        const dataLotes = await resLotes.json();
        setLots(dataLotes);
      } catch (error) {
        console.error("Error de red al cargar fincas/lotes:", error);
      }
    }

    loadData();
  }, [loading, isAuthenticated, authFetch]);

  const selectedFarm = useMemo(() => {
    if (selectedFarmId === null) return null;
    return farms.find((farm) => farm.id === selectedFarmId) || null;
  }, [farms, selectedFarmId]);

  const filteredLots = useMemo(() => {
    if (selectedFarmId === null) return [];
    return lots.filter((lot) => (lot.finca ?? lot.fincaId) === selectedFarmId);
  }, [lots, selectedFarmId]);

  const stats = useMemo(() => {
    const totalArea = farms.reduce(
      (acc, farm) => acc + Number(farm.area_total ?? farm.areatotal ?? 0),
      0
    );

    return {
      totalFarms: farms.length,
      totalLots: lots.length,
      selectedFarmLots: filteredLots.length,
      totalArea,
    };
  }, [farms, lots, filteredLots]);

  const formatNumber = (value) =>
    new Intl.NumberFormat("es-CO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  const handleSaveFarm = async (farmData) => {
    try {
      if (editingFarm) {
        const res = await authFetch(`${API.fincas}/${editingFarm.id}/`, {
          method: "PUT",
          body: JSON.stringify(farmData),
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error("Error al editar finca:", res.status, errorData);
          return;
        }

        const updatedFarm = await res.json();
        setFarms((prev) =>
          prev.map((farm) => (farm.id === editingFarm.id ? updatedFarm : farm))
        );
        setSelectedFarmId(updatedFarm.id);
        setEditingFarm(null);
      } else {
        const res = await authFetch(`${API.fincas}/`, {
          method: "POST",
          body: JSON.stringify(farmData),
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error("Error al crear finca:", res.status, errorData);
          return;
        }

        const newFarm = await res.json();
        setFarms((prev) => [...prev, newFarm]);
        setSelectedFarmId(newFarm.id);
        setEditingLot(null);
      }
    } catch (error) {
      console.error("Error de red al guardar finca:", error);
    }
  };

  const handleEditFarm = (farm) => {
    setEditingFarm(farm);
    setEditingLot(null);
    setSelectedFarmId(farm.id);
  };

  const handleCancelEditFarm = () => {
    setEditingFarm(null);
  };

  const handleDeleteFarm = async (farmId) => {
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar esta finca?"
    );
    if (!confirmDelete) return;

    try {
      const res = await authFetch(`${API.fincas}/${farmId}/`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Error al eliminar finca:", res.status);
        return;
      }

      setFarms((prev) => {
        const updated = prev.filter((farm) => farm.id !== farmId);

        if (selectedFarmId === farmId) {
          setSelectedFarmId(updated.length > 0 ? updated[0].id : null);
        }

        return updated;
      });

      setLots((prev) =>
        prev.filter((lot) => (lot.finca ?? lot.fincaId) !== farmId)
      );

      if (editingFarm?.id === farmId) {
        setEditingFarm(null);
      }
    } catch (error) {
      console.error("Error de red al eliminar finca:", error);
    }
  };

  const handleSaveLot = async (lotData) => {
    if (!lotData.finca) return;

    try {
      if (editingLot) {
        const res = await authFetch(`${API.lotes}/${editingLot.id}/`, {
          method: "PUT",
          body: JSON.stringify(lotData),
        });

        if (!res.ok) {
          console.error("Error al editar lote:", res.status);
          return;
        }

        const updatedLot = await res.json();
        setLots((prev) =>
          prev.map((lot) => (lot.id === editingLot.id ? updatedLot : lot))
        );
        setEditingLot(null);
      } else {
        const res = await authFetch(`${API.lotes}/`, {
          method: "POST",
          body: JSON.stringify(lotData),
        });

        if (!res.ok) {
          console.error("Error al crear lote:", res.status);
          return;
        }

        const newLot = await res.json();
        setLots((prev) => [...prev, newLot]);
      }
    } catch (error) {
      console.error("Error de red al guardar lote:", error);
    }
  };

  const handleEditLot = (lot) => {
    setEditingLot({
      ...lot,
      fincaId: lot.finca ?? lot.fincaId,
      tipo_suelo: lot.tipo_suelo ?? lot.tipoSuelo,
    });
    setEditingFarm(null);
    setSelectedFarmId(lot.finca ?? lot.fincaId);
  };

  const handleDeleteLot = async (lotId) => {
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar este lote?"
    );
    if (!confirmDelete) return;

    try {
      const res = await authFetch(`${API.lotes}/${lotId}/`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Error al eliminar lote:", res.status);
        return;
      }

      setLots((prev) => prev.filter((lot) => lot.id !== lotId));
    } catch (error) {
      console.error("Error de red al eliminar lote:", error);
    }
  };

  const handleCancelEditLot = () => {
    setEditingLot(null);
  };

  return (
    <div className="fl-page">
      <header className="fl-hero">
        <div className="fl-hero__content">
          <span className="fl-eyebrow">Gestión agrícola</span>
          <h1>Registro de fincas y lotes</h1>
          <p>
            Centraliza la base productiva, organiza tus fincas y administra los
            lotes desde una sola vista.
          </p>
        </div>

        <div className="fl-hero__chips">
          <span className="fl-chip">Módulo operativo</span>
          <span className="fl-chip fl-chip--accent">
            {selectedFarm ? "Finca activa" : "Sin selección"}
          </span>
        </div>
      </header>

      <section className="fl-stats">
        <article className="fl-stat-card">
          <span className="fl-stat-card__label">Fincas registradas</span>
          <strong>{stats.totalFarms}</strong>
          <p>Total de unidades productivas creadas.</p>
        </article>

        <article className="fl-stat-card">
          <span className="fl-stat-card__label">Lotes registrados</span>
          <strong>{stats.totalLots}</strong>
          <p>Inventario general de lotes en el sistema.</p>
        </article>

        <article className="fl-stat-card">
          <span className="fl-stat-card__label">Área acumulada</span>
          <strong>{formatNumber(stats.totalArea)} ha</strong>
          <p>Suma del área total reportada por las fincas.</p>
        </article>

        <article className="fl-stat-card fl-stat-card--highlight">
          <span className="fl-stat-card__label">Lotes de la finca activa</span>
          <strong>{selectedFarm ? stats.selectedFarmLots : "--"}</strong>
          <p>
            {selectedFarm
              ? `Asociados a ${selectedFarm.nombre}.`
              : "Selecciona una finca para ver el detalle."}
          </p>
        </article>
      </section>

      <section className="fl-layout">
        <div className="fl-column">
          <div className="fl-card fl-card--soft">
            <FarmForm
              onSave={handleSaveFarm}
              editingFarm={editingFarm}
              onCancelEdit={handleCancelEditFarm}
            />
          </div>

          <div className="fl-card fl-card--list">
            <FarmList
              farms={farms}
              selectedFarmId={selectedFarmId}
              onSelect={setSelectedFarmId}
              onEdit={handleEditFarm}
              onDelete={handleDeleteFarm}
            />
          </div>
        </div>

        <div className="fl-column">
          <div className="fl-card fl-card--summary">
            <div className="section-header">
              <h2>Finca seleccionada</h2>
              <p>Resumen contextual para registrar y revisar sus lotes.</p>
            </div>

            {selectedFarm ? (
              <div className="farm-summary">
                <div className="farm-summary__top">
                  <div>
                    <span className="farm-summary__eyebrow">Finca activa</span>
                    <h3>{selectedFarm.nombre}</h3>
                  </div>

                  <span className="farm-summary__tag">
                    {filteredLots.length} lote{filteredLots.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="farm-summary__grid">
                  <div className="farm-summary__item">
                    <span>Departamento</span>
                    <strong>{selectedFarm.departamento || "Sin dato"}</strong>
                  </div>

                  <div className="farm-summary__item">
                    <span>Municipio</span>
                    <strong>{selectedFarm.municipio || "Sin dato"}</strong>
                  </div>

                  <div className="farm-summary__item">
                    <span>Vereda</span>
                    <strong>{selectedFarm.vereda || "Sin dato"}</strong>
                  </div>

                  <div className="farm-summary__item">
                    <span>Área total</span>
                    <strong>
                      {formatNumber(
                        selectedFarm.area_total ?? selectedFarm.areatotal ?? 0
                      )}{" "}
                      ha
                    </strong>
                  </div>

                  <div className="farm-summary__item farm-summary__item--full">
                    <span>Tipo de suelo</span>
                    <strong>{selectedFarm.tipo_suelo || "Sin dato"}</strong>
                  </div>
                </div>

                {selectedFarm.observaciones ? (
                  <div className="farm-summary__note">
                    <span>Observaciones</span>
                    <p>{selectedFarm.observaciones}</p>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="empty-box">
                Primero selecciona una finca para visualizar su resumen y
                gestionar sus lotes.
              </div>
            )}
          </div>

          <div className="fl-card fl-card--soft">
            <LotForm
              farms={farms}
              currentFarmId={selectedFarmId}
              editingLot={editingLot}
              onSave={handleSaveLot}
              onCancelEdit={handleCancelEditLot}
            />
          </div>
        </div>
      </section>

      <section className="fl-card fl-card--table">
        <LotTable
          lots={filteredLots}
          selectedFarm={selectedFarm}
          onEdit={handleEditLot}
          onDelete={handleDeleteLot}
        />
      </section>
    </div>
  );
}

export default FarmsLotsPage;