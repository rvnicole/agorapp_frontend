import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import ButtonCreate from "../components/layout/ButtonCreate";
import Navbar from "../components/layout/Navbar";
import { useEffect } from "react";
import { useUserStore } from "../store/userStore";
import { useMessageStore } from "../store/messageStore";
import Spinner from "../components/ui/Spinner";

export default function LayoutApp() {
    const { user: { alias }, consulted } = useUserStore();
    const { setNewNotification, showMessages } = useMessageStore();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    
    useEffect(() => {
        console.log(consulted, alias);
        
        if( consulted && !alias?.length ) {
            navigate("/create-alias");  
        }              
    }, [alias, consulted]);

    useEffect(() => {
        navigator.serviceWorker.addEventListener("message", (event) => {
            console.log("Notificado", event);
            if( event.data && event.data.type === "NEW_NOTIFICATION" ){
                console.log("Nueva notificacion", event.data);
                setNewNotification(true);
            };
        });
        console.log("effect del service worker");
        window.addEventListener("offline", () => {
            showMessages("warning", "Sin conexión a internet");
        });
    }, []);

    if( !consulted ) return <Spinner />
    return (
        <div>
            { !["/create-alias"].includes(pathname) && <Header /> }
            
            <main  className="w-full m-auto md:px-4 md:py-6">
                <div className="h-full bg-background pb-20 md:pb-8">
                    <Outlet />

                    { !["/create-report", "/create-alias"].includes(pathname) &&
                        <ButtonCreate 
                            className=""
                            text="Crear un reporte"
                            onClick={() => navigate("/create-report")}
                        />
                    }
                </div>
            </main>

            { !["/create-alias"].includes(pathname) && 
                <Navbar onCreate={() => navigate("/create-report")} /> 
            }
        </div>
    )
}