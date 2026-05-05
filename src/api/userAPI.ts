import { agorappApi } from "../lib/agorappApi";
import { handleApiError } from "./handleAgorappError";
import { ApiError } from "../errors/ApiError";
import { RespuestaUploadImage, UserDataSchema } from "../schemas";
import type { UserData } from "../types";

export async function getUserData(){
    try{
        const url = "/user";
        const res = await agorappApi.post(url, { a: "hola macto" });
        const { success, data, error } = UserDataSchema.safeParse(res.data.data);
        if( !success ){
            console.log({ error });
            throw new ApiError([`Error al obtener los datos del usuario - ${error.message}`]);
        };
        return data;
    }
    catch( error ){
        handleApiError(error);
    };
};

export async function updateImageProfile(formData: FormData){
    try{
        const url = `/usuario/img`;
        const res = await agorappApi.patch(url, formData);
        console.log(res.data);
        const { data, success, error } = RespuestaUploadImage.safeParse(res.data.data);
        if( !success ){
            console.error("error en esquema", error);
            throw new Error(error.message);
        };
        return data;

    }
    catch(error){
        handleApiError(error);
    };
};

export async function registerAlias(data: Pick<UserData, "nombre"|"apellido"|"alias">){
    try{
        const url = "/usuario";
        const res = await agorappApi.put(url, data);
        return res.data;

    }
    catch(error){
        handleApiError(error);
    };
};