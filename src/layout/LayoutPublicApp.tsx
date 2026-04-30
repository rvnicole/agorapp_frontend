import { Outlet, useNavigate } from "react-router-dom";
import Title from "../components/layout/Title";
import Encabezado from "../components/ui/Encabezado";
import MenuPublic from "../components/layout/MenuPublic";
import ThemeSelector from "../components/layout/ThemeSelector";
import ButtonCreate from "../components/layout/ButtonCreate";
import Navbar from "../components/layout/Navbar";

export default function LayoutPublicApp() {
    const navigate = useNavigate();

    return (
        <div>
            <Encabezado>
                <div className="flex items-center gap-3">
                    <MenuPublic />
                    <Title />
                </div>

                <ThemeSelector />
            </Encabezado>

            <main  className="w-full m-auto md:px-4 md:py-6">
                <div className="h-full bg-background pb-20 md:pb-8">
                    <Outlet />

                    <ButtonCreate
                        text="Crear un reporte"
                        onClick={() => navigate("/auth/login")}
                    />
                </div>

                <Navbar onCreate={() => navigate("/auth/login")} /> 
            </main>
        </div>
    )
}