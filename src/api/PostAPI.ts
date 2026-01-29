import { AxiosError } from "axios";
import { APIAgorAppError } from "../errors/ApiError";
import { agorappApi } from "../lib/agorappApi";
import type { Post } from "../types";

export async function createPost(post : Post) {
    try {
        console.log("Post", post);
        const errors = [];

        const formData = new FormData();
        formData.append("titulo", post.titulo);
        formData.append("descripcion", post.descripcion);
        formData.append("tipo", post.tipo);
        formData.append("categoriaId", String(post.categoriaId));
        formData.append("usuarioId", String(post.usuarioId));

        // En reporte la ubicación es obligatoria
        if( post.tipo === "reporte" && !post.imgs.length ) {
            errors.push("Debes subir al menos una imagen");
        }

        post.imgs.forEach(img => {
            console.log("img", img);
            formData.append("imgs", img);
        });

        // En reporte la ubicación es obligatoria
        if( post.tipo === "reporte" && (post.lat == null || post.lng == null) ) {
            errors.push("La ubicación es obligatoria");
        }

        if( post.lat == null || post.lng == null ) {
            formData.append("lat", String(post.lat));
            formData.append("lon", String(post.lng));
        }

        if( post.tipo === "aviso" || post.tipo === "publicidad" ) {
            // La organización es obligatoria
            if( post.organizacionId ) {
                formData.append("organizacionId", String(post.organizacionId));
            }
            else {
                errors.push(`Tu ${post.tipo} debe ser creada desde la organización`);
            }

            // El link es opcional
            if ( post.link ) {
                formData.append("link", post.link);
            }
        }

        if( errors.length ) {
            throw new APIAgorAppError(errors);
        }

        const res = await agorappApi.post("/posts", formData);
        const respuesta = res.data;

        if( !respuesta.success ) {
            const apiErrors = respuesta.errors.map((error: { msg: string }) => error.msg );
            throw new APIAgorAppError(apiErrors);
        }

        return respuesta.data;
    }
    catch( error ) {
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
}