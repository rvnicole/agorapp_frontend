import { AxiosError } from "axios";
import { AddressError } from "../errors/ApiError";
import { geoApi } from "../lib/geoApi";
import { AddressResultSchema, AddressSchema } from "../schemas";
import type { AddressResult, NewUbicacionType } from "../types";

export async function getAddress({ lat, lng }: NewUbicacionType): Promise<string> {
    try {
        const res = await geoApi.get("/reverse", {
            params: {
                format: "json",
                lat: lat,
                lon: lng
            }
        });

        const result = AddressSchema.safeParse(res.data);
        
        if( !result.success ) {
            const errors = result.error.issues.map(error => error.message);
            console.log(errors);
            throw new AddressError(errors);
        }

        const { road, city, county, state, country } = result.data.address;
        return `${road ? road + "," : ""} ${city ? city : county}, ${state}, ${country}`;
    }
    catch(error) {
        // Axios error (network o timeout)
        if (error instanceof AxiosError) {
            throw new AddressError(["No se pudo conectar con el servicio"]);
        }

        // Error de validación (Zod)
        if (error instanceof AddressError) {
            throw new AddressError(["No se pudieron procesar los datos recibidos"]);
        }

        // Error desconocido
        throw new AddressError(["Ocurrió un error inesperado"]);
    }
}

export async function searchAddress( query: string ): Promise<AddressResult []> {
    try {
        const res = await geoApi.get("/search", {
            params: {
                format: "jsonv2",
                q: query
            }
        });

        const result = AddressResultSchema.array().safeParse(res.data);

        if( !result.success ) {
            const errors = result.error.issues.map(error => error.message);
            console.log(errors);
            throw new AddressError(errors);
        }

        return result.data;
    }
    catch(error) {
        // Axios error (network o timeout)
        if (error instanceof AxiosError) {
            throw new AddressError(["No se pudo conectar con el servicio"]);
        }

        // Error de validación (Zod)
        if (error instanceof AddressError) {
            throw new AddressError(["No se pudieron procesar los datos recibidos"]);
        }

        // Error desconocido
        throw new AddressError(["Ocurrió un error inesperado"]);
    }
}