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
            if( Notification.permission === "default" ) {
                const notificationPermission = await Notification.requestPermission();
                checkNotificationPermission(notificationPermission);
            }
            else if( Notification.permission === "granted" ){
                checkNotificationPermission(Notification.permission);
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

    const checkNotificationPermission = async (notificationPermission: string) => {
        if( notificationPermission === "granted" ){
            const tokenStorage = localStorage.getItem("fb_token");
            const pushToken = await getNotificationToken();
            if( !tokenStorage && pushToken ){
                localStorage.setItem("fb_token", pushToken);
                mutatePushToken({pushToken, platform: "firebase"});
            } 
            else if( tokenStorage && pushToken && tokenStorage !== pushToken ){
                mutatePushToken({pushToken, platform: "firebase"});
            };
        };
    };

    if( isPending ) return (
        <>
            <div className="text-center">
                <Spinner/>
                <p className="text-xl">Iniciando Agorapp...</p>
            </div>
        </>
    )
};