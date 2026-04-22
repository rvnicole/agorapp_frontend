import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import ButtonCreate from "../components/layout/ButtonCreate";
import Navbar from "../components/layout/Navbar";
import { useEffect } from "react";

export default function LayoutApp() {
    const navigate = useNavigate();

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div>
            <Header />

            <main  className="w-full m-auto md:px-4 md:py-6">
                <div className="h-full bg-background pb-20 md:pb-8">
                    <Outlet />
                    <ButtonCreate 
                        className=""
                        text="Crear un reporte"
                        onClick={() => navigate("/create-report")}
                    />
                </div>
            </main>

            <Navbar onCreate={() => navigate("/create-report")} />
        </div>
    )
}