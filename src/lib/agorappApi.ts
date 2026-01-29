import axios from "axios";

export const agorappApi = axios.create({
    baseURL: import.meta.env.VITE_AGORAPP_API_BACKEND,
    timeout: 10_000
});