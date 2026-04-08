import { useMutation } from "@tanstack/react-query";
import { createPushToken } from "../api/notificationsAPI";
import type { ApiErrorType } from "../types";
import { useMessageStore } from "../store/messageStore";
import { getNotificationToken } from "../api/firebase";
import { deleteToken, getMessaging } from "firebase/messaging";

export default function useNotification(){
    const { showMessages } = useMessageStore( state => state );

    const { mutate: mutatePushToken } = useMutation({
        mutationFn: createPushToken,
        onError: (error: ApiErrorType) => {
            error.messages.forEach((error: string) => showMessages("error", error));
            showMessages("error", "Error al registrar el push token");
        },
        onSuccess: () => {
            showMessages("success", "Notificaciones activadas");
        }
    });

    const checkNotificationPermission = async (notificationPermission: "default" | "denied" | "granted") => {
        if( notificationPermission === "default" || notificationPermission === "granted" ){
            await Notification.requestPermission();
            const tokenStorage = localStorage.getItem("fb_token");
            const pushToken = await getNotificationToken();
            if( !tokenStorage && pushToken ){
                localStorage.setItem("fb_token", pushToken);
                mutatePushToken({pushToken, platform: "firebase"});
                return true;
            } 
            else if( tokenStorage && pushToken && tokenStorage !== pushToken ){
                mutatePushToken({pushToken, platform: "firebase"});
                return true;
            };
            return false;
        }
        else if( notificationPermission === "denied" ){
            showMessages("info", "Para activar las notificaciones debe habilitarlas desde el navegador");
            return false;
        };
    };

    const deactivateNotifications = async () => {
        localStorage.removeItem("fb_token")
        const messaging = getMessaging();
        await deleteToken(messaging);
        showMessages("info", "Notificaciones desactivadas");
        console.log("No mas notificaciones");
    };

    return { checkNotificationPermission, deactivateNotifications }
};