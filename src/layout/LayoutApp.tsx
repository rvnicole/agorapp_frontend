import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import ButtonCreate from "../components/layout/ButtonCreate";
import Navbar from "../components/layout/Navbar";
import { useEffect } from "react";
import { useUserStore } from "../store/userStore";

export default function LayoutApp() {
    const { user: { alias } } = useUserStore();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    
    /*
    useEffect(() => {
        if( alias?.length ) return;
        navigate("/create-alias");        
    }, [alias]);
    */

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