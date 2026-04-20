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

    const API_URL = import.meta.env.VITE_API_URL;

    // Cargar fincas y lotes desde el backend al montar el componente
    useEffect(() => {
        async function loadData() {
            try {
                // 1. Cargar fincas
                const resFincas = await fetch(`${API_URL}/fincas/`);
                if (!resFincas.ok) {
                    console.error("Error al cargar fincas:", resFincas.status);
                    return;
                }
                const dataFincas = await resFincas.json();
                setFarms(dataFincas);

                if (dataFincas.length > 0) {
                    setSelectedFarmId(dataFincas[0].id);
                }

                // 2. Cargar lotes
                const resLotes = await fetch(`${API_URL}/lotes/`);
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
    }, [API_URL]);

    const selectedFarm = useMemo(() => {
        if (selectedFarmId === null) return null;
        return farms.find((farm) => farm.id === selectedFarmId) || null;
    }, [farms, selectedFarmId]);

    const filteredLots = useMemo(() => {
        if (selectedFarmId === null) return [];
        return lots.filter((lot) => lot.finca === selectedFarmId || lot.fincaId === selectedFarmId);
    }, [lots, selectedFarmId]);

    // Crear finca en backend
    const handleAddFarm = async (farmData) => {
        try {
            const res = await fetch(`${API_URL}/fincas/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
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

    // Crear o actualizar lote en backend
    const handleSaveLot = async (lotData) => {
        if (!lotData.fincaId && !lotData.finca) return;

        // Asegurar que enviamos el campo correcto para Django (finca = id de la finca)
        const payload = {
            finca: lotData.fincaId || lotData.finca,
            area: lotData.area,
            ubicacion: lotData.ubicacion,
            tipo_suelo: lotData.tipoSuelo,
            estado: lotData.estado,
        };

        try {
            if (editingLot) {
                // EDITAR lote existente: PUT /lotes/:id/
                const res = await fetch(`${API_URL}/lotes/${editingLot.id}/`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                if (!res.ok) {
                    console.error("Error al actualizar lote:", res.status);
                    return;
                }

                const updatedLot = await res.json();
                setLots((prev) =>
                    prev.map((lot) => (lot.id === updatedLot.id ? updatedLot : lot))
                );
                setEditingLot(null);
            } else {
                // CREAR lote nuevo: POST /lotes/
                const res = await fetch(`${API_URL}/lotes/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
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
        // el backend devuelve 'finca' como id de finca
        setSelectedFarmId(lot.finca || lot.fincaId);
    };

    const handleCancelEdit = () => {
        setEditingLot(null);
    };

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
                    <FarmForm onSave={handleAddFarm} />
                </div>

                <div className="fl-card">
                    <FarmList
                        farms={farms}
                        selectedFarmId={selectedFarmId}
                        onSelect={setSelectedFarmId}
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
                            <h3>{selectedFarm.nombre}</h3>
                            <p>
                                <strong>Ubicación:</strong> {selectedFarm.ubicacion}
                            </p>
                            <p>
                                <strong>Características:</strong> {selectedFarm.caracteristicas}
                            </p>
                        </div>
                    ) : (
                        <div className="empty-box">
                            Primero registra o selecciona una finca.
                        </div>
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
                />
            </section>
        </>
    );
}

export default FarmsLotsPage;