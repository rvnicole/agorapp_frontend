import { useLocation, useNavigate } from "react-router-dom";
import Spinner from "../../components/ui/Spinner";
import { useMutation } from "@tanstack/react-query";
import { useMessageStore } from "../../store/messageStore";
import { loginOnAgorapp } from "../../api/authAPI";
import { useEffect, useRef } from "react";
import { useUserStore } from "../../store/userStore";
import type { ApiErrorType } from "../../types";
import useNotification from "../../hooks/useNotifications";

export default function LoadUserProfile(){
    const solicitud = useRef(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { showMessages } = useMessageStore( state => state );
    const { setUserData } = useUserStore( state => state );
    const { checkNotificationPermission } = useNotification();
    
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
            userData.alias ? navigate("/") : navigate("/create-alias");
        },
        retry: false
    });

    useEffect(()=>{
        /*
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
        */
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
};