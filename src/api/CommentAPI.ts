import { agorappApi } from "../lib/agorappApi";
import { APIAgorAppError } from "../errors/ApiError";
import { handleApiError } from "./handleAgorappError";
import { ComentarioRespuestaSchema, ComentarioSchema } from "../schemas";
import type { ComentarioRespuesta, Post } from "../types";

export async function createComment({ id, createdAt, usuarioId, comentario, replyCommentId }: Pick<Post, "id"|"createdAt"|"usuarioId"> & Pick<ComentarioRespuesta, "comentario"|"replyCommentId">) {
    try {
        const url = (`/post/${id}/${createdAt}/comentario`).replace("+", "%2B");
        const res = await agorappApi.post(url, { 
            comentario, 
            replyCommentId,
            postOwnerId: usuarioId
        });
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
};

export async function getComments({ id, createdAt }: Pick<Post, "id"|"createdAt"> ) {
    try {
        const url = (`/post/${id}/${createdAt}/comentarios`).replace("+", "%2B");
        const res = await agorappApi.get(url);
        const respuesta = res.data;

        if( !respuesta.success ) {
            const apiErrors = respuesta.errors.map((error: { msg: string }) => error.msg );
            throw new APIAgorAppError(apiErrors);
        }
        
        const result = ComentarioSchema.array().safeParse(respuesta.data);

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

export async function getCommentsAnswered({ id, createdAt, replyCommentId }: Pick<Post, "id"|"createdAt"> & Pick<ComentarioRespuesta, "replyCommentId"> ) {
    try {
        const url = (`/post/${id}/${createdAt}/comentarios/${replyCommentId}`).replace("+", "%2B");
        const res = await agorappApi.get(url);
        const respuesta = res.data;
        console.log(respuesta);

        if( !respuesta.success ) {
            const apiErrors = respuesta.errors.map((error: { msg: string }) => error.msg );
            throw new APIAgorAppError(apiErrors);
        }
        
        const result = ComentarioSchema.array().safeParse(respuesta.data);

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