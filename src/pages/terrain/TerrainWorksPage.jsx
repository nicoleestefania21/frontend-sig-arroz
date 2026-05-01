import { useEffect, useMemo, useState } from "react";
import { API } from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import TerrainLaborForm from "../../components/terrain/TerrainLaborForm";
import TerrainLaborTable from "../../components/terrain/TerrainLaborTable";
import "../../styles/terrain-labors.css";

function TerrainWorksPage() {
    const { authFetch, loading, isAuthenticated } = useAuth();

    const [farms, setFarms] = useState([]);
    const [lots, setLots] = useState([]);
    const [labors, setLabors] = useState([]);

    const [selectedFarmId, setSelectedFarmId] = useState(null);
    const [selectedLotId, setSelectedLotId] = useState(null);
    const [editingLabor, setEditingLabor] = useState(null);

    const [filters, setFilters] = useState({
        tipo: "",
        fecha: "",
    });

    const [feedback, setFeedback] = useState({
        type: "",
        message: "",
    });

    const [pageLoading, setPageLoading] = useState(true);

    const formatNumber = (value) =>
        new Intl.NumberFormat("es-CO", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(Number(value || 0));

    const formatDate = (value) => {
        if (!value) return "Sin fecha";
        return new Intl.DateTimeFormat("es-CO", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(new Date(`${value}T00:00:00`));
    };

    useEffect(() => {
        if (loading || !isAuthenticated) return;

        async function loadBaseData() {
            setPageLoading(true);
            try {
                const [resFincas, resLotes] = await Promise.all([
                    authFetch(`${API.fincas}/`),
                    authFetch(`${API.lotes}/`),
                ]);

                if (!resFincas.ok || !resLotes.ok) {
                    setFeedback({
                        type: "error",
                        message: "No fue posible cargar fincas y lotes.",
                    });
                    return;
                }

                const [dataFincas, dataLotes] = await Promise.all([
                    resFincas.json(),
                    resLotes.json(),
                ]);

                setFarms(dataFincas);
                setLots(dataLotes);

                const farmId = dataFincas[0]?.id ?? null;
                const currentFarmId = selectedFarmId ?? farmId;

                setSelectedFarmId((prev) => prev ?? farmId);

                const lotsOfFarm = dataLotes.filter(
                    (lot) => (lot.finca ?? lot.fincaId) === currentFarmId
                );

                setSelectedLotId((prev) => prev ?? lotsOfFarm[0]?.id ?? null);
            } catch (error) {
                console.error("Error al cargar datos base:", error);
                setFeedback({
                    type: "error",
                    message: "Error de red al consultar fincas y lotes.",
                });
            } finally {
                setPageLoading(false);
            }
        }

        loadBaseData();
    }, [loading, isAuthenticated, authFetch]);

    const selectedFarm = useMemo(() => {
        return farms.find((farm) => farm.id === selectedFarmId) || null;
    }, [farms, selectedFarmId]);

    const farmLots = useMemo(() => {
        return lots.filter((lot) => (lot.finca ?? lot.fincaId) === selectedFarmId);
    }, [lots, selectedFarmId]);

    useEffect(() => {
        if (!farmLots.length) {
            setSelectedLotId(null);
            return;
        }

        const exists = farmLots.some((lot) => lot.id === selectedLotId);
        if (!exists) {
            setSelectedLotId(farmLots[0].id);
        }
    }, [farmLots, selectedLotId]);

    const selectedLot = useMemo(() => {
        return lots.find((lot) => lot.id === selectedLotId) || null;
    }, [lots, selectedLotId]);

    const loadLabors = async (lotId) => {
        if (!lotId) {
            setLabors([]);
            return;
        }

        try {
            const res = await authFetch(`${API.labores}/?lote=${lotId}`);
            if (!res.ok) {
                setFeedback({
                    type: "error",
                    message: "No fue posible consultar el historial del lote.",
                });
                return;
            }

            const data = await res.json();
            setLabors(data);
        } catch (error) {
            console.error("Error al cargar labores:", error);
            setFeedback({
                type: "error",
                message: "Error de red al consultar labores de terreno.",
            });
        }
    };

    useEffect(() => {
        if (loading || !isAuthenticated) return;
        loadLabors(selectedLotId);
    }, [selectedLotId, loading, isAuthenticated]);

    const filteredLabors = useMemo(() => {
        return labors.filter((labor) => {
            const matchTipo = filters.tipo
                ? labor.tipo_labor.toLowerCase().includes(filters.tipo.toLowerCase())
                : true;

            const matchFecha = filters.fecha ? labor.fecha === filters.fecha : true;

            return matchTipo && matchFecha;
        });
    }, [labors, filters]);

    const stats = useMemo(() => {
        const lotsInPreparation = lots.filter(
            (lot) => lot.estado === "EN_PREPARACION"
        ).length;

        const laborsWithConditions = labors.filter(
            (labor) => labor.ph !== null || labor.humedad !== null
        ).length;

        return {
            totalFarms: farms.length,
            totalLots: lots.length,
            totalLabors: labors.length,
            lotsInPreparation,
            laborsWithConditions,
        };
    }, [farms, lots, labors]);

    const handleSaveLabor = async (formData) => {
        try {
            const payload = {
                ...formData,
                lote: Number(formData.lote),
                ph: formData.ph === "" || formData.ph === null ? null : Number(formData.ph),
                humedad:
                    formData.humedad === "" || formData.humedad === null
                        ? null
                        : Number(formData.humedad),
            };

            const endpoint = editingLabor
                ? `${API.labores}/${editingLabor.id}/`
                : `${API.labores}/`;

            const method = editingLabor ? "PUT" : "POST";

            const res = await authFetch(endpoint, {
                method,
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Error al guardar labor:", errorData);
                setFeedback({
                    type: "error",
                    message:
                        errorData?.detail ||
                        errorData?.error ||
                        "No fue posible guardar la labor de terreno.",
                });
                return;
            }

            setFeedback({
                type: "success",
                message: editingLabor
                    ? "Labor de terreno actualizada correctamente."
                    : "Labor de terreno registrada correctamente.",
            });

            setEditingLabor(null);
            await loadLabors(payload.lote);
        } catch (error) {
            console.error("Error de red al guardar labor:", error);
            setFeedback({
                type: "error",
                message: "Error de red al guardar la labor de terreno.",
            });
        }
    };

    const handleEditLabor = (labor) => {
        setEditingLabor({
            ...labor,
            lote: labor.lote ?? selectedLotId,
            ph: labor.ph ?? "",
            humedad: labor.humedad ?? "",
        });
    };

    const handleDeleteLabor = async (laborId) => {
        const confirmDelete = window.confirm(
            "¿Seguro que deseas eliminar este registro de labor de terreno?"
        );
        if (!confirmDelete) return;

        try {
            const res = await authFetch(`${API.labores}/${laborId}/`, {
                method: "DELETE",
            });

            if (!res.ok) {
                setFeedback({
                    type: "error",
                    message: "No fue posible eliminar la labor seleccionada.",
                });
                return;
            }

            setFeedback({
                type: "success",
                message: "Registro eliminado correctamente.",
            });

            setLabors((prev) => prev.filter((labor) => labor.id !== laborId));
            if (editingLabor?.id === laborId) {
                setEditingLabor(null);
            }
        } catch (error) {
            console.error("Error de red al eliminar labor:", error);
            setFeedback({
                type: "error",
                message: "Error de red al eliminar la labor.",
            });
        }
    };

    const handleCancelEdit = () => {
        setEditingLabor(null);
    };

    if (loading || pageLoading) {
        return (
            <div className="tl-page">
                <div className="tl-empty-box">Cargando módulo de labores de terreno...</div>
            </div>
        );
    }

    return (
        <div className="tl-page">
            <header className="tl-hero">
                <div className="tl-hero__content">
                    <span className="tl-eyebrow">HU-004 · Preparación del terreno</span>
                    <h1>Registro de labores de terreno</h1>
                    <p>
                        Documenta el alistamiento previo a la siembra, registra condiciones
                        del suelo y consulta el historial operativo por lote.
                    </p>
                </div>

                <div className="tl-hero__chips">
                    <span className="tl-chip">Operación agrícola</span>
                    <span className="tl-chip tl-chip--accent">
                        {selectedLot ? "Lote activo" : "Sin lote seleccionado"}
                    </span>
                </div>
            </header>

            {feedback.message ? (
                <div
                    className={`tl-feedback ${feedback.type === "success" ? "tl-feedback--success" : "tl-feedback--error"
                        }`}
                >
                    {feedback.message}
                </div>
            ) : null}

            <section className="tl-stats">
                <article className="tl-stat-card">
                    <span className="tl-stat-card__label">Fincas disponibles</span>
                    <strong>{stats.totalFarms}</strong>
                    <p>Contexto base para asociar las labores registradas.</p>
                </article>

                <article className="tl-stat-card">
                    <span className="tl-stat-card__label">Lotes cargados</span>
                    <strong>{stats.totalLots}</strong>
                    <p>Total de lotes visibles para selección operativa.</p>
                </article>

                <article className="tl-stat-card">
                    <span className="tl-stat-card__label">Historial del lote</span>
                    <strong>{stats.totalLabors}</strong>
                    <p>Registros encontrados para el lote activo.</p>
                </article>

                <article className="tl-stat-card tl-stat-card--highlight">
                    <span className="tl-stat-card__label">Con pH o humedad</span>
                    <strong>{stats.laborsWithConditions}</strong>
                    <p>Registros del historial con condiciones del suelo reportadas.</p>
                </article>
            </section>

            <section className="tl-layout">
                <div className="tl-column">
                    <div className="tl-card tl-card--summary">
                        <div className="section-header">
                            <h2>Contexto de registro</h2>
                            <p>Selecciona finca y lote antes de registrar la labor.</p>
                        </div>

                        <div className="tl-selector-grid">
                            <div className="form-group">
                                <label>Finca</label>
                                <select
                                    value={selectedFarmId ?? ""}
                                    onChange={(e) => setSelectedFarmId(Number(e.target.value))}
                                >
                                    <option value="">Selecciona una finca</option>
                                    {farms.map((farm) => (
                                        <option key={farm.id} value={farm.id}>
                                            {farm.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Lote</label>
                                <select
                                    value={selectedLotId ?? ""}
                                    onChange={(e) => setSelectedLotId(Number(e.target.value))}
                                    disabled={!farmLots.length}
                                >
                                    <option value="">Selecciona un lote</option>
                                    {farmLots.map((lot) => (
                                        <option key={lot.id} value={lot.id}>
                                            {lot.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {selectedLot ? (
                            <div className="tl-summary">
                                <div className="tl-summary__top">
                                    <div>
                                        <span className="tl-summary__eyebrow">Lote activo</span>
                                        <h3>{selectedLot.nombre}</h3>
                                    </div>

                                    <span className="tl-summary__tag">
                                        {selectedLot.estado_display || selectedLot.estado}
                                    </span>
                                </div>

                                <div className="tl-summary__grid">
                                    <div className="tl-summary__item">
                                        <span>Finca</span>
                                        <strong>{selectedFarm?.nombre || "Sin dato"}</strong>
                                    </div>

                                    <div className="tl-summary__item">
                                        <span>Área</span>
                                        <strong>{formatNumber(selectedLot.area)} ha</strong>
                                    </div>

                                    <div className="tl-summary__item">
                                        <span>Tipo de suelo</span>
                                        <strong>{selectedLot.tipo_suelo || "Sin dato"}</strong>
                                    </div>

                                    <div className="tl-summary__item">
                                        <span>Estado</span>
                                        <strong>{selectedLot.estado_display || selectedLot.estado}</strong>
                                    </div>

                                    <div className="tl-summary__item">
                                        <span>Latitud</span>
                                        <strong>{selectedLot.latitud ?? "Sin dato"}</strong>
                                    </div>

                                    <div className="tl-summary__item">
                                        <span>Longitud</span>
                                        <strong>{selectedLot.longitud ?? "Sin dato"}</strong>
                                    </div>
                                </div>

                                {selectedLot.observaciones ? (
                                    <div className="tl-summary__note">
                                        <span>Observaciones del lote</span>
                                        <p>{selectedLot.observaciones}</p>
                                    </div>
                                ) : null}
                            </div>
                        ) : (
                            <div className="tl-empty-box">
                                Selecciona una finca y un lote para habilitar el registro de labores.
                            </div>
                        )}
                    </div>
                </div>

                <div className="tl-column">
                    <div className="tl-card tl-card--soft">
                        <TerrainLaborForm
                            lots={farmLots}
                            selectedLotId={selectedLotId}
                            editingLabor={editingLabor}
                            onSave={handleSaveLabor}
                            onCancelEdit={handleCancelEdit}
                        />
                    </div>
                </div>
            </section>

            <section className="tl-card tl-card--table">
                <TerrainLaborTable
                    labors={filteredLabors}
                    selectedLot={selectedLot}
                    filters={filters}
                    onFilterChange={setFilters}
                    onEdit={handleEditLabor}
                    onDelete={handleDeleteLabor}
                    formatDate={formatDate}
                />
            </section>
        </div>
    );
}

export default TerrainWorksPage;