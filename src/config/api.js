const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const API = {
    base: BASE_URL,
    users: `${BASE_URL}/users`,
    fincas: `${BASE_URL}/fincas`,
    lotes: `${BASE_URL}/lotes`,
    sowings: `${BASE_URL}/siembras`,
    labores: `${BASE_URL}/labores`,
    ciclos: `${BASE_URL}/ciclos/ciclos`,
    planificaciones: `${BASE_URL}/ciclos/planificaciones`,
    historialCiclos: `${BASE_URL}/ciclos/historial`,
};