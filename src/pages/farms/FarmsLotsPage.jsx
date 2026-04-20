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

    // Cargar fincas y lotes desde el backend al montar el componente
    useEffect(() => {
        async function loadData() {
            try {
                // 1. Cargar fincas
                const resFincas = await fetch(
                    `${import.meta.env.VITE_API_URL}/fincas/`
                );
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
                const resLotes = await fetch(
                    `${import.meta.env.VITE_API_URL}/lotes/`
                );
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
    }, []);

    const selectedFarm = useMemo(() => {
        if (selectedFarmId === null) return null;
        return farms.find((farm) => farm.id === selectedFarmId) || null;
    }, [farms, selectedFarmId]);

    const filteredLots = useMemo(() => {
        if (selectedFarmId === null) return [];
        return lots.filter((lot) => lot.fincaId === selectedFarmId);
    }, [lots, selectedFarmId]);

    // Por ahora sigue siendo solo en memoria; luego lo podemos conectar con POST al backend
    const handleAddFarm = (farmData) => {
        const newFarm = {
            id: Date.now(),
            ...farmData,
        };

        setFarms((prev) => [...prev, newFarm]);
        setSelectedFarmId(newFarm.id);
        setEditingLot(null);
    };

    // Igual aquí: de momento actualiza el estado local
    const handleSaveLot = (lotData) => {
        if (!lotData.fincaId) return;

        if (editingLot) {
            setLots((prev) =>
                prev.map((lot) =>
                    lot.id === editingLot.id ? { ...lot, ...lotData } : lot
                )
            );
            setEditingLot(null);
            return;
        }

        const newLot = {
            id: Date.now(),
            ...lotData,
        };

        setLots((prev) => [...prev, newLot]);
    };

    const handleEditLot = (lot) => {
        setEditingLot(lot);
        setSelectedFarmId(lot.fincaId);
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