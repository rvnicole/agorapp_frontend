import { useLocation, useNavigate } from "react-router-dom";
import Spinner from "../../components/ui/Spinner";
import { useMutation } from "@tanstack/react-query";
import { useMessageStore } from "../../store/messageStore";
import { loginOnAgorapp } from "../../api/authAPI";
import { useEffect, useRef } from "react";
import { useUserStore } from "../../store/userStore";

export default function LoadUserProfile(){
    const solicitud = useRef(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { showMessages } = useMessageStore( state => state );
    const { setUserData } = useUserStore( state => state );
    
    const { mutate, isPending } = useMutation({
        mutationFn: loginOnAgorapp,
        onError: (error) => {
            if("messages" in error && Array.isArray(error.messages)) {
                error.messages.forEach((error: string) => showMessages("error", error)); 
            }
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

    useEffect(()=>{
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