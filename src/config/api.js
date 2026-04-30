const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const API = {
    base: BASE_URL,
    users: `${BASE_URL}/users`,
    fincas: `${BASE_URL}/fincas`,
    lotes: `${BASE_URL}/lotes`,
    sowings: `${BASE_URL}/sowings`,
};