import { APIAgorAppError } from "../errors/ApiError";
import { agorappApi } from "../lib/agorappApi";
import { handleApiError } from "./handleAgorappError";
import { DescriptionRespuestaSchema, PostRespuestaSchema, PostsUsuarioRespuestaSchema, ResponseMapPostListSchema } from "../schemas";
import type { BoundsMap, Post, RequestListPost, UserData } from "../types";
import { comprimirImagen } from "../utils/imageCompression";

export async function createPost(post : Post) {
    try {
        console.log("Post", post);
        const errors = [];

        const formData = new FormData();
        formData.append("titulo", post.titulo);
        formData.append("descripcion", post.descripcion);
        formData.append("tipo", post.tipo);
        formData.append("categoriaId", String(post.categoriaId));
        //formData.append("usuarioId", String(post.usuarioId));

        // En reporte la ubicación es obligatoria
        if( post.tipo === "reporte" && !post.imgs.length ) {
            errors.push("Debes subir al menos una imagen");
        }

        const imagenesComprimidas = await Promise.all(post.imgs.map( img => comprimirImagen(img)));

        imagenesComprimidas.forEach(img => {
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

        const res = await agorappApi.post("/post", formData);
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
            console.log({result, res});
            const errors = result.error.issues.map(error => error.message);
            throw new APIAgorAppError(errors);
        }

        return result.data;
    }
    catch( error ) {
        handleApiError( error );
    }
};

export async function getPosts({ lat, lng, distancia="2000", lastId, lastPostDate }: RequestListPost) {
    try {
        let url = `/post/?lat=${lat}&lon=${lng}&distancia=${distancia}`;
        if( lastId && lastPostDate ) url += `&lastId=${lastId}&lastPostDate=${lastPostDate.replace("+", "%2B")}`;
        const res = await agorappApi.get(url);
        const respuesta = res.data;

        if( !respuesta.success ) {
            const apiErrors = respuesta.errors.map((error: { msg: string }) => error.msg );
            throw new APIAgorAppError(apiErrors);
        }

        const result = PostRespuestaSchema.array().safeParse(respuesta.data);

        if( !result.success ) {
            const errors = result.error.issues.map(error => error.message);
            throw new APIAgorAppError(errors);
        }

        return result.data;
    }
    catch( error ) {
        handleApiError( error );
    }
};

export async function getMapPosts({ neLat, neLng, swLat, swLng }: BoundsMap) {
    try {
        let url = `/map-post/?neLat=${neLat}&neLng=${neLng}&swLat=${swLat}&swLng=${swLng}`;
        const res = await agorappApi.get(url);
        const respuesta = res.data;
        //alert(`Ejecuta el fetch con datos ${neLat}`)

        if( !respuesta.success ) {
            const apiErrors = respuesta.errors.map((error: { msg: string }) => error.msg );
            throw new APIAgorAppError(apiErrors);
        }

        const result = ResponseMapPostListSchema.array().safeParse(respuesta.data);

        if( !result.success ) {
            const errors = result.error.issues.map(error => error.message);
            throw new APIAgorAppError(errors);
        }

        return result.data;
    }
    catch( error ) {
        handleApiError( error );
    }
};

export async function getUserPosts( lastPostDate?: RequestListPost["lastPostDate"] ) {
    try {
        const url = `/user-post?lastPostDate=${lastPostDate}`.replace("+", "%2B");
    
        const res = await agorappApi.get(url);
        const respuesta = res.data;

        if( !respuesta.success ) {
            const apiErrors = respuesta.errors.map((error: { msg: string }) => error.msg );
            throw new APIAgorAppError(apiErrors);
        }

        const result = PostsUsuarioRespuestaSchema.array().safeParse(respuesta.data);

        if( !result.success ) {
            console.log("Error zod", result.error.message);
            const errors = result.error.issues.map(error => error.message);
            throw new APIAgorAppError(errors);
        }

        return result.data;
    }
    catch( error ) {
        handleApiError( error );
    }
};

export async function getRefinedDescription(description: string) {
    try {
        const res = await agorappApi.post("/llm-process-post", { description });
        const respuesta = res.data;

        if( !respuesta.success ) {
            const apiErrors = respuesta.errors.map((error: { msg: string }) => error.msg );
            throw new APIAgorAppError(apiErrors);
        }

        const result = DescriptionRespuestaSchema.safeParse(respuesta.data);
        console.log(result)
        if( !result.success ) {
            const errors = result.error.issues.map(error => error.message);
            throw new APIAgorAppError(errors);
        }

        return result.data;
    }
    catch( error ) {
        handleApiError( error );
    }
};

export async function deletePost({ id, createdAt }: Pick<Post, "id"|"createdAt"> ) {
    try {
        const url = (`/post/${id}?createdAt=${createdAt}`).replace("+", "%2B");
        const res = await agorappApi.delete(url);
        return res;
    }
    catch( error ) {
        handleApiError( error );
    }
}

export async function updateLikeStatus({ id, liked, createdAt, alias }: Pick<Post, "id"|"liked"|"createdAt"> & Pick<UserData, "alias">) {
    try {
        if( liked ) {
            const url = (`/like?postId=${id}&postCreatedAt=${createdAt}`).replace("+", "%2B");
            const res = await agorappApi.delete(url);
            return res;
        }
        else {
            const res = await agorappApi.post("/like", {
                postId: id,
                postCreatedAt: createdAt,
                alias
            });

            return res;
        }
    }
    catch( error ) {
        handleApiError( error );
    }
}