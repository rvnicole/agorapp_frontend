import { useLocation, useNavigate } from "react-router-dom";
import Spinner from "../../components/ui/Spinner";
import { useMutation } from "@tanstack/react-query";
import { useMessageStore } from "../../store/messageStore";
import { loginOnAgorapp } from "../../api/authAPI";
import { useEffect, useRef } from "react";
import { useUserStore } from "../../store/userStore";
import type { ApiErrorType } from "../../types";
import { createPushToken } from "../../api/notificationsAPI";
import { getNotificationToken } from "../../api/firebase";

export default function LoadUserProfile(){
    const solicitud = useRef(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { showMessages } = useMessageStore( state => state );
    const { setUserData } = useUserStore( state => state );
    
    const { mutate, isPending } = useMutation({
        mutationFn: loginOnAgorapp,
        onError: (error: ApiErrorType) => {
            error.messages.forEach((error: string) => showMessages("error", error));
            navigate("/auth/login");
        },
        onSuccess: (userData) => {
            showMessages("success", "Sesión iniciada");
            localStorage.setItem("userData", JSON.stringify(userData));
            setUserData(userData!);
            navigate("/");
        },
        retry: false
    });

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

    useEffect(()=>{
        const requestNotificationPermission = async () => {
            if( Notification.permission === "granted" ){
                console.log("Solicitar token a firebase porque ya se dio permiso desde antes");
                const pushToken = await getNotificationToken();
                if( pushToken ) mutatePushToken({pushToken, platform: "firebase"});
                console.log("proceso terminado porque ya se habia dado permiso desde antes", { pushToken });
            };
        };
        requestNotificationPermission();
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get("code") || "";
        const deviceInfo = window.navigator.userAgent;
        if( solicitud.current ) return;
        solicitud.current = true;
        mutate({ code, deviceInfo });
    },[]);

    if( isPending ) return (
        <>
            <div className="text-center">
                <Spinner/>
                <p className="text-xl">Iniciando Agorapp...</p>
            </div>
        </>
    )
}