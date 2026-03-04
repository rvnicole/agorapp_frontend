import { ApiError } from "../errors/ApiError";
import { agorappApi } from "../lib/agorappApi";
import { UserDataSchema } from "../schemas";
import { handleApiError } from "./handleAgorappError";

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