import { Link } from "react-router-dom";
import ThemeSelector from "./ThemeSelector";
import Menu from "./Menu";
import { Bell } from "lucide-react";
import Title from "./Title";
import Encabezado from "../ui/Encabezado";

export default function Header() {
    return (
        <Encabezado>
            <div className="flex items-center gap-3">
                <Menu />
                <Title link="/"/>
            </div>

            <div className="flex gap-1">
                <ThemeSelector />

                <Link 
                    className="hidden md:flex items-center justify-center size-9 rounded hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
                    to="/notifications"
                >
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notificaciones</span>
                </Link>     
            </div>
        </Encabezado>
    )
}