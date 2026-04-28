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
  const [editingLot, setEditingLot] = useState(null);

  // Cargar fincas y lotes desde el backend solo cuando ya hay sesión
  useEffect(() => {
    if (loading || !isAuthenticated) return;

    async function loadData() {
      try {
        // 1. Cargar fincas
        const resFincas = await authFetch(`${API.fincas}/`);
        if (!resFincas.ok) {
          console.error("Error al cargar fincas:", resFincas.status);
          return;
        }
        const dataFincas = await resFincas.json();
        setFarms(dataFincas);

        // Seleccionar la primera finca si existe
        if (dataFincas.length > 0) {
          setSelectedFarmId(dataFincas[0].id);
        }

        // 2. Cargar lotes
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
    return lots.filter((lot) => lot.finca === selectedFarmId);
  }, [lots, selectedFarmId]);

  // Crear finca en el backend
  const handleAddFarm = async (farmData) => {
    try {
      const res = await authFetch(`${API.fincas}/`, {
        method: "POST",
        body: JSON.stringify(farmData),
      });

      if (!res.ok) {
        console.error("Error al crear finca:", res.status);
        return;
      }

      const newFarm = await res.json();
      setFarms((prev) => [...prev, newFarm]);
      setSelectedFarmId(newFarm.id);
      setEditingLot(null);
    } catch (error) {
      console.error("Error de red al crear finca:", error);
    }
  };

  // Crear o editar lote en el backend
  const handleSaveLot = async (lotData) => {
    if (!lotData.finca) return;

    try {
      if (editingLot) {
        // Editar lote existente
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
        // Crear lote nuevo
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
    setEditingLot(lot);
    setSelectedFarmId(lot.finca);
  };

  const handleCancelEdit = () => {
    setEditingLot(null);
  };

  return (
    <>
      <div className="farms-lots-layout">
        {/* Panel izquierdo: fincas */}
        <aside className="farms-panel">
          <FarmForm onSave={handleAddFarm} />
          <FarmList
            farms={farms}
            selectedFarmId={selectedFarmId}
            onSelect={setSelectedFarmId}
          />
        </aside>

        {/* Panel derecho: lotes */}
        <main className="lots-panel">
          <div className="selected-farm-info">
            <h2>Finca seleccionada</h2>
            <p>El lote se registrará asociado a esta finca.</p>

            {selectedFarm ? (
              <div className="farm-detail">
                <strong>{selectedFarm.nombre}</strong>
                <p>Ubicación: {selectedFarm.ubicacion}</p>
                <p>Características: {selectedFarm.caracteristicas}</p>
              </div>
            ) : (
              <p className="text-muted">
                Primero registra o selecciona una finca.
              </p>
            )}
          </div>

          <LotForm
            farms={farms}
            selectedFarmId={selectedFarmId}
            editingLot={editingLot}
            onSave={handleSaveLot}
            onCancel={handleCancelEdit}
          />

          <LotTable lots={filteredLots} onEdit={handleEditLot} />
        </main>
      </div>
    </>
  );
}

export default FarmsLotsPage;