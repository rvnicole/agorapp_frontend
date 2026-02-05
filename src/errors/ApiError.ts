export class ApiError extends Error {
    constructor(
        public messages: string[],
        public code?: string
    ) {
        super("API Error");
    }
};

// Errores de la APP
export class AgorAppError extends ApiError {}

// Errores de la API de nominatim
export class AddressError extends ApiError {}

// Errores de la API del Backend
export class APIAgorAppError extends ApiError {}