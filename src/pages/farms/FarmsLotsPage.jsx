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

  const handleEditFarm = async (farm) => {
    const nuevoNombre = window.prompt("Editar nombre de la finca", farm.nombre);
    if (nuevoNombre === null) return;

    const nuevaUbicacion = window.prompt("Editar ubicación", farm.ubicacion);
    if (nuevaUbicacion === null) return;

    const nuevasCaracteristicas = window.prompt(
      "Editar características",
      farm.caracteristicas
    );
    if (nuevasCaracteristicas === null) return;

    const payload = {
      nombre: nuevoNombre,
      ubicacion: nuevaUbicacion,
      caracteristicas: nuevasCaracteristicas,
    };

    try {
      const res = await authFetch(`${API.fincas}/${farm.id}/`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Error al editar finca:", res.status);
        return;
      }

      const updatedFarm = await res.json();
      setFarms((prev) =>
        prev.map((item) => (item.id === farm.id ? updatedFarm : item))
      );
    } catch (error) {
      console.error("Error de red al editar finca:", error);
    }
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

  const handleCancelEdit = () => {
    setEditingLot(null);
  };

  return (
    <div className="farms-lots-layout">
      <aside className="farms-panel">
        <FarmForm onSave={handleAddFarm} />
        <FarmList
          farms={farms}
          selectedFarmId={selectedFarmId}
          onSelect={setSelectedFarmId}
          onEdit={handleEditFarm}
          onDelete={handleDeleteFarm}
        />
      </aside>

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
          currentFarmId={selectedFarmId}
          editingLot={editingLot}
          onSave={handleSaveLot}
          onCancelEdit={handleCancelEdit}
        />

        <LotTable
          lots={filteredLots}
          selectedFarm={selectedFarm}
          onEdit={handleEditLot}
          onDelete={handleDeleteLot}
        />
      </main>
    </div>
  );
}

export default FarmsLotsPage;