import { useMemo, useState, useEffect } from "react";
import FarmForm from "../../components/farms/FarmForm";
import FarmList from "../../components/farms/FarmList";
import LotForm from "../../components/lots/LotForm";
import LotTable from "../../components/lots/LotTable";
import "../../styles/farms-lots.css";

function FarmsLotsPage() {
    const [farms, setFarms] = useState([]);
    const [lots, setLots] = useState([]);
    const [selectedFarmId, setSelectedFarmId] = useState(null);
    const [editingLot, setEditingLot] = useState(null);
    const [editingFarm, setEditingFarm] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        async function loadData() {
            try {
                const resFincas = await fetch(`${API_URL}/fincas/`);
                if (!resFincas.ok) { console.error("Error al cargar fincas:", resFincas.status); return; }
                const dataFincas = await resFincas.json();
                setFarms(dataFincas);
                if (dataFincas.length > 0) setSelectedFarmId(dataFincas[0].id);

                const resLotes = await fetch(`${API_URL}/lotes/`);
                if (!resLotes.ok) { console.error("Error al cargar lotes:", resLotes.status); return; }
                const dataLotes = await resLotes.json();
                setLots(dataLotes);
            } catch (error) {
                console.error("Error de red al cargar fincas/lotes:", error);
            }
        }
        loadData();
    }, [API_URL]);

    const selectedFarm = useMemo(() => {
        if (selectedFarmId === null) return null;
        return farms.find((farm) => farm.id === selectedFarmId) || null;
    }, [farms, selectedFarmId]);

    const filteredLots = useMemo(() => {
        if (selectedFarmId === null) return [];
        return lots.filter((lot) => lot.finca === selectedFarmId);
    }, [lots, selectedFarmId]);

    // ── FINCAS ──────────────────────────────────────────────
    const handleAddFarm = async (farmData) => {
        try {
            if (editingFarm) {
                // EDITAR finca existente (PUT)
                const res = await fetch(`${API_URL}/fincas/${editingFarm.id}/`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(farmData),
                });
                const body = await res.clone().text();
                console.log("PUT /fincas/ STATUS:", res.status, "BODY:", body);
                if (!res.ok) { console.error("Error al actualizar finca:", res.status); return; }
                const updatedFarm = await res.json();
                setFarms((prev) => prev.map((f) => (f.id === updatedFarm.id ? updatedFarm : f)));
                setEditingFarm(null);
            } else {
                // CREAR nueva finca (POST)
                const res = await fetch(`${API_URL}/fincas/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(farmData),
                });
                const body = await res.clone().text();
                console.log("POST /fincas/ STATUS:", res.status, "BODY:", body);
                if (!res.ok) { console.error("Error al crear finca:", res.status); return; }
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
        setSelectedFarmId(farm.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCancelEditFarm = () => {
        setEditingFarm(null);
    };

    const handleDeleteFarm = async (farmId) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta finca? También se eliminarán sus lotes.")) return;
        try {
            const res = await fetch(`${API_URL}/fincas/${farmId}/`, { method: "DELETE" });
            if (!res.ok) { console.error("Error al eliminar finca:", res.status); return; }
            setFarms((prev) => prev.filter((f) => f.id !== farmId));
            setLots((prev) => prev.filter((l) => l.finca !== farmId));
            setSelectedFarmId((prev) => {
                const remaining = farms.filter((f) => f.id !== farmId);
                return remaining.length > 0 ? remaining[0].id : null;
            });
            if (editingFarm?.id === farmId) setEditingFarm(null);
        } catch (error) {
            console.error("Error de red al eliminar finca:", error);
        }
    };

    // ── LOTES ───────────────────────────────────────────────
    const handleSaveLot = async (lotData) => {
        if (!lotData.finca) return;
        const payload = lotData;

        try {
            if (editingLot) {
                const res = await fetch(`${API_URL}/lotes/${editingLot.id}/`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                const body = await res.clone().text();
                console.log("PUT /lotes/ STATUS:", res.status, "BODY:", body);
                if (!res.ok) { console.error("Error al actualizar lote:", res.status); return; }
                const updatedLot = await res.json();
                setLots((prev) => prev.map((l) => (l.id === updatedLot.id ? updatedLot : l)));
                setEditingLot(null);
            } else {
                const res = await fetch(`${API_URL}/lotes/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                const body = await res.clone().text();
                console.log("POST /lotes/ STATUS:", res.status, "BODY:", body);
                if (!res.ok) { console.error("Error al crear lote:", res.status); return; }
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

    const handleDeleteLot = async (lotId) => {
        if (!window.confirm("¿Seguro que deseas eliminar este lote?")) return;
        try {
            const res = await fetch(`${API_URL}/lotes/${lotId}/`, { method: "DELETE" });
            if (!res.ok) { console.error("Error al eliminar lote:", res.status); return; }
            setLots((prev) => prev.filter((l) => l.id !== lotId));
            if (editingLot?.id === lotId) setEditingLot(null);
        } catch (error) {
            console.error("Error de red al eliminar lote:", error);
        }
    };

    const handleCancelEdit = () => setEditingLot(null);

    return (
        <>
            <header className="fl-header">
                <div>
                    <h1>Registro de fincas y lotes</h1>
                    <p>Administra la información base de la explotación agrícola.</p>
                </div>
            </header>

            <section className="fl-grid fl-grid--top">
                <div className="fl-card">
                    <FarmForm
                        onSave={handleAddFarm}
                        editingFarm={editingFarm}
                        onCancelEdit={handleCancelEditFarm}
                    />
                </div>

                <div className="fl-card">
                    <FarmList
                        farms={farms}
                        selectedFarmId={selectedFarmId}
                        onSelect={setSelectedFarmId}
                        onEdit={handleEditFarm}
                        onDelete={handleDeleteFarm}
                    />
                </div>
            </section>

            <section className="fl-grid fl-grid--middle">
                <div className="fl-card">
                    <div className="section-header">
                        <h2>Finca seleccionada</h2>
                        <p>El lote se registrará asociado a esta finca.</p>
                    </div>

                    {selectedFarm ? (
                        <div className="farm-summary">
                            <p><strong>Nombre:</strong> {selectedFarm.nombre}</p>
                            <p><strong>Ubicación:</strong> {selectedFarm.departamento}, {selectedFarm.municipio}, vereda {selectedFarm.vereda}</p>
                            <p><strong>Área total:</strong> {selectedFarm.area_total} ha</p>
                            <p><strong>Tipo de suelo:</strong> {selectedFarm.tipo_suelo}</p>
                            {selectedFarm.observaciones && (
                                <p><strong>Observaciones:</strong> {selectedFarm.observaciones}</p>
                            )}
                        </div>
                    ) : (
                        <div className="empty-box">Primero registra o selecciona una finca.</div>
                    )}
                </div>

                <div className="fl-card">
                    <LotForm
                        farms={farms}
                        currentFarmId={selectedFarmId}
                        editingLot={editingLot}
                        onSave={handleSaveLot}
                        onCancelEdit={handleCancelEdit}
                    />
                </div>
            </section>

            <section className="fl-card">
                <LotTable
                    lots={filteredLots}
                    selectedFarm={selectedFarm}
                    onEdit={handleEditLot}
                    onDelete={handleDeleteLot}
                />
            </section>
        </>
    );
}

export default FarmsLotsPage;