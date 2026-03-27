import { AxiosError, isAxiosError } from "axios";
import { APIAgorAppError } from "../errors/ApiError";
import type { ZodError } from "zod";

type Errores = Error | APIAgorAppError | AxiosError | ZodError | unknown;

export function handleApiError(error: Errores): never {
    console.log(error);
    
    // Axios error 
    if (isAxiosError(error)) {
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

    // Error estandar
    if( error instanceof Error ) throw new APIAgorAppError([error.message]);

    throw new APIAgorAppError(["Ocurrió un error inesperado", JSON.stringify(error)]);
}