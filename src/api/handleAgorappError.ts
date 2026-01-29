import { AxiosError } from "axios";
import { APIAgorAppError } from "../errors/ApiError";

export function handleApiError(error: unknown): APIAgorAppError {
    // Axios error 
    if (error instanceof AxiosError) {
        // Errores de peticion devueltos por la API
        if( error.response?.data.errors ) {
            const apiErrors = error.response.data.errors.map((error: { msg: string }) => error.msg );
            throw new APIAgorAppError(apiErrors);
        }
        // Errores (network o timeout)
        throw new APIAgorAppError(["No se pudo conectar con el servicio"]);
    }

    // Errores en al formar el formData
    if (error instanceof APIAgorAppError) {
        throw error;
    }

    // Error desconocido
    throw new APIAgorAppError(["Ocurrió un error inesperado"]);
}