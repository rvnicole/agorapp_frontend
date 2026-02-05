import { Outlet, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/appStore";
import Header from "../components/layout/Header";
import ButtonCreate from "../components/layout/ButtonCreate";

export default function LayoutApp() {
    const { setTheme } = useAppStore(state => state);
    const navigate = useNavigate();

    return (
        <div>
            <Header />

            <main  className="container m-auto px-4 py-6">
                <div className="h-full bg-background pb-20 md:pb-8">
                    <Outlet />
                    <ButtonCreate 
                        className=""
                        text="Crear un reporte"
                        onClick={() => navigate("/create-report")}
                    />
                </div>
            </main>
        </div>
    )
}