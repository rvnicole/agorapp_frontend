import { APIAgorAppError } from "../errors/ApiError";
import { agorappApi } from "../lib/agorappApi";
import { handleApiError } from "./handleAgorappError";
import { PostRespuestaSchema } from "../schemas";
import type { Post } from "../types";

export async function createPost(post : Post) {
    try {
        console.log("Post", post);
        const errors = [];

        const formData = new FormData();
        //formData.append("titulo", post.titulo);
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

        if( post.lat != null || post.lng != null ) {
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
        handleApiError( error );
    }
}

export async function getPost({ id, createdAt }: Pick<Post, "id" | "createdAt">) {
    try {
        const url = (`/post/${id}?createdAt=${createdAt}`).replace("+", "%2B");
    
        const res = await agorappApi.get(url);
        const respuesta = res.data;

        if( !respuesta.success ) {
            const apiErrors = respuesta.errors.map((error: { msg: string }) => error.msg );
            throw new APIAgorAppError(apiErrors);
        }

        const result = PostRespuestaSchema.array().safeParse(respuesta.data);

        if( !result.success ) {
            const errors = result.error.issues.map(error => error.message);
            console.log(errors);
            throw new APIAgorAppError(errors);
        }

        return result.data;
    }
    catch( error ) {
        handleApiError( error );
    }
};