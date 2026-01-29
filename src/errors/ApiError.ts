export class ApiError extends Error {
    constructor(
        public messages: string[],
        public code?: string
    ) {
        super("API Error");
    }
};

// Errores de la API de nominatim
export class AddressError extends ApiError {}
export class APIAgorAppError extends ApiError {}