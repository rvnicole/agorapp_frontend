import { agorappApi } from "../lib/agorappApi";
import { handleApiError } from "./handleAgorappError";
import { APIAgorAppError } from "../errors/ApiError";
import { EstadoSchema } from "../schemas";
import type { NewEstado, Post } from "../types";

export async function getEstados({ id, createdAt }: Pick<Post, "id"|"createdAt">) {
    try {
        const url = `/estados-post/${id}?createdAt=${createdAt}`.replace("+", "%2B");;
        const res = await agorappApi.get(url);
        const respuesta = res.data;

        if( !respuesta.success ) {
            const apiErrors = respuesta.errors.map((error: { msg: string }) => error.msg );
            throw new APIAgorAppError(apiErrors);
        }

        const result = EstadoSchema.array().safeParse(respuesta.data);

        if( !result.success ) {
            const errors = result.error.issues.map(error => error.message);
            throw new APIAgorAppError(errors);
        }

        return result.data;
    }
    catch(error) {
        handleApiError(error);
    }
}

export async function createEstado(data: NewEstado & { postId: Post["id"], postCreatedAt: Post["createdAt"], postOwnerId: number }) {
    try {
        const url = "/estado-post";
        const res = await agorappApi.post(url, data);
        return res.data;
    }
    catch(error) {
        handleApiError(error);
    }
}