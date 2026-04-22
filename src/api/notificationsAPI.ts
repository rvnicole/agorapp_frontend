import { APIAgorAppError } from "../errors/ApiError";
import { agorappApi } from "../lib/agorappApi";
import { NotificationSchema, ResponseCreatePushToken } from "../schemas";
import type { Notification } from "../types";
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

export async function getNotifications({ createdAt }: { createdAt?: Notification["notification_created_at"] }) {
    try {
        const url = createdAt === undefined ? "/notifications" : (`/notifications?lastNotificationDate=${createdAt}`).replace("+", "%2B");
        
        const res = await agorappApi.get(url);
        const respuesta = res.data;

        if( !respuesta.success ) {
            const apiErrors = respuesta.errors.map((error: { msg: string }) => error.msg );
            throw new APIAgorAppError(apiErrors);
        }

        const result = NotificationSchema.array().safeParse(respuesta.data);

        if( !result.success ) {
            console.log({result, res});
            const errors = result.error.issues.map(error => error.message);
            throw new APIAgorAppError(errors);
        }

        return result.data;
    }
    catch(error) {
        handleApiError(error);
    }
};

export async function deleteNotification({ receptor_id }: Pick<Notification, "receptor_id">) {
    try {
        const url = `/notificacion-receptor/${receptor_id}`;        
        const res = await agorappApi.delete(url);
        const respuesta = res.data;        

        return respuesta;
        return { success: true }
    }
    catch(error) {
        handleApiError(error);
    }
};

export async function updateNotification({ receptor_id }: Pick<Notification, "receptor_id">) {
    try {
        const url = "/notificacion-receptor";        
        const res = await agorappApi.put(url, {
            receptorId: receptor_id
        });
        const respuesta = res.data;        

        return respuesta;
    }
    catch(error) {
        handleApiError(error);
    }
};