import { APIAgorAppError } from "../errors/ApiError";
import { agorappApi } from "../lib/agorappApi";
import { ResponseCreatePushToken } from "../schemas";
import { handleApiError } from "./handleAgorappError";

export const createPushToken = async ({ pushToken, platform }:  { pushToken: string, platform:string }) => {
    try{
        const url = "/create-push-token";
        const { data } = await agorappApi.post(url, { pushToken, platform });
        const { success, data: dataPushToken, error } = ResponseCreatePushToken.safeParse(data.data);
        if( !success ){
            const errors = error.issues.map(error => error.message);
            throw new APIAgorAppError(errors);
        }
        return dataPushToken;
    }
    catch(error){
        handleApiError(error);
    };
};