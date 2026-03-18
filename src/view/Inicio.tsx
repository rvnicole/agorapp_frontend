import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import { agorappApi } from "../lib/agorappApi";
import { useUserStore } from "../store/userStore";
import { deleteToken } from "firebase/messaging";
import { getNotificationToken, messaging } from "../api/firebase";
import { useMutation } from "@tanstack/react-query";
import { createPushToken } from "../api/notificationsAPI";
import type { ApiErrorType } from "../types";
import { useMessageStore } from "../store/messageStore";
import { useEffect } from "react";

export default function Inicio() {
    const { setUserData } =  useUserStore();
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

    useEffect(()=> {
        const requestNotificationPermission = async () => {
            if( Notification.permission === "default" ) {
                const notificationPermission = await Notification.requestPermission();
                if( notificationPermission === "granted" ){
                    const pushToken = await getNotificationToken();
                    if( pushToken ) mutatePushToken({pushToken, platform: "firebase"});
                };
            };
        };
        requestNotificationPermission();
    }, []);

    // ESTO ES UNA PRUEBA PARA CONTROLAR EL CIERRE DE SESION 
    const navigate = useNavigate();
    const handleLogout = async () => {
        localStorage.removeItem("userData");
        const res = await deleteToken(messaging);
        console.log("token push eliminado", res);
        const { data } = await agorappApi.get("/logout");
        if( data.success ) {
            flushSync(() => setUserData({
                email: "",
                nombre: "",
                apellido: "",
                alias: "",
                createdAt: "",
                esp: "",
                url_img: ""
            }));
            navigate("/auth/login");
        }
    };

    const cookie = async () => {
        if("vibrate" in navigator ) {
            navigator.vibrate(200);
        };
        const res = await agorappApi.get("/usuario");
        console.log(res);
    }

    const deleteUser = async () => {
        const res = await agorappApi.delete("/usuario");
        console.log(res);
    };
    
    return (
        <div className="bg-none">
            <p>Inicio</p>
            <div>
                <button onClick={handleLogout} className="text-xl">Logout</button>
            </div>
            <div>
                <button onClick={cookie} className="text-xl">Cookie</button>
            </div>
            <div>
                <button onClick={deleteUser} className="text-xl">Eliminar usuario</button>
            </div>
        </div>
    )
}