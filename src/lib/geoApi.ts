import axios from "axios";

export const geoApi = axios.create({
    baseURL: "https://nominatim.openstreetmap.org",
    timeout: 10_000,
    headers: {
        "Content-Type": "application/json"
    },
});