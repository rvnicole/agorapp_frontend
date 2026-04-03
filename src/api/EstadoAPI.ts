import { agorappApi } from "../lib/agorappApi";
import { handleApiError } from "./handleAgorappError";
import type { NewEstado, Post } from "../types";

export async function createEstado(data: NewEstado & { postId: Post["id"], postCreatedAt: Post["createdAt"] }) {
    try {
        const url = "/estado-post";
        const res = await agorappApi.post(url, data);
        return res.data;
    }
    catch(error) {
        handleApiError(error);
    }
}