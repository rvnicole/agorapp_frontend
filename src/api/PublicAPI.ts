import { agorappApi } from "../lib/agorappApi";
import { handleApiError } from "./handleAgorappError";
import { APIAgorAppError } from "../errors/ApiError";
import { PostRespuestaSchema } from "../schemas";
import type { Post } from "../types";

export async function getPublicPost({ id, createdAt }: Pick<Post, "id" | "createdAt">) {
    try {
        const url = (`public-post/${id}?createdAt=${createdAt}`).replace("+", "%2B");
    
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