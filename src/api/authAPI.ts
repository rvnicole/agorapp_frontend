import { handleApiError } from "./handleAgorappError";
import { agorappApi } from "../lib/agorappApi";
import { googleAuthURL, UserDataSchema } from "../schemas";
import { APIAgorAppError } from "../errors/ApiError";

export async function loginWithGoogle(){
    try{
        const url = `/auth-google`;
        const { data: res } = await agorappApi.get(url);
        const { success, data, error } = googleAuthURL.safeParse(res.data);
        if( !success ){
            throw new APIAgorAppError([error.message]);
        };
        return data;
    }
    catch(error){
        handleApiError(error);
    };
};

export async function loginOnAgorapp({ code, deviceInfo }: { code: string, deviceInfo: string }){
    try{
        const url = "/auth-receiver/google-callback";
        const res = await agorappApi.post(url, { code, deviceInfo });
        console.log({res});
        const { success, data, error } = UserDataSchema.safeParse(res.data.data);
        if( !success ){
            console.log({ error });
            throw new APIAgorAppError([`Error al iniciar sesión - ${error.message}`]);
        }
        return data;
    }
    catch(error){
        handleApiError(error);
    };
};