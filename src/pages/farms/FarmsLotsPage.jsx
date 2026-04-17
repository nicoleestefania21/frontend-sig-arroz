import { useMemo, useState } from "react";
import FarmForm from "../../components/farms/FarmForm";
import FarmList from "../../components/farms/FarmList";
import LotForm from "../../components/lots/LotForm";
import LotTable from "../../components/lots/LotTable";
import "../../styles/farms-lots.css";

const initialFarms = [
    {
        id: 1,
        nombre: "Finca El Mirador",
        ubicacion: "Cúcuta, vereda La Floresta",
        caracteristicas: "Riego por goteo, acceso vehicular, 12 ha",
    },
    {
        id: 2,
        nombre: "Finca La Esperanza",
        ubicacion: "Villa del Rosario, vereda Palmarito",
        caracteristicas: "Pozo de agua, bodega, 8 ha",
    },
];

const initialLots = [
    {
        id: 101,
        fincaId: 1,
        area: "2.5",
        ubicacion: "Sector Norte",
        tipoSuelo: "Franco-arcilloso",
        estado: "Activo",
    },
    {
        id: 102,
        fincaId: 1,
        area: "1.8",
        ubicacion: "Sector Sur",
        tipoSuelo: "Arcilloso",
        estado: "En preparación",
    },
    {
        id: 103,
        fincaId: 2,
        area: "3.1",
        ubicacion: "Bloque A",
        tipoSuelo: "Franco-arenoso",
        estado: "Cosechado",
    },
];

function FarmsLotsPage() {
    const [farms, setFarms] = useState(initialFarms);
    const [lots, setLots] = useState(initialLots);
    // Inicia con la primera finca seleccionada si existe, o null si no hay fincas
    const [selectedFarmId, setSelectedFarmId] = useState(
        initialFarms.length > 0 ? initialFarms[0].id : null
    );
    const [editingLot, setEditingLot] = useState(null);

    const selectedFarm = useMemo(() => {
        if (selectedFarmId === null) return null;
        return farms.find((farm) => farm.id === selectedFarmId) || null;
    }, [farms, selectedFarmId]);

    const filteredLots = useMemo(() => {
        if (selectedFarmId === null) return [];
        return lots.filter((lot) => lot.fincaId === selectedFarmId);
    }, [lots, selectedFarmId]);

    const handleAddFarm = (farmData) => {
        const newFarm = {
            id: Date.now(),
            ...farmData,
        };

        setFarms((prev) => [...prev, newFarm]);
        setSelectedFarmId(newFarm.id);
        setEditingLot(null);
    };

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
                            <p><strong>Ubicación:</strong> {selectedFarm.ubicacion}</p>
                            <p><strong>Características:</strong> {selectedFarm.caracteristicas}</p>
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