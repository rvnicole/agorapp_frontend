import { useMessageStore } from "../../store/messageStore";
import { Link } from "react-router-dom";
import Menu from "./Menu";
import Title from "./Title";
import ThemeSelector from "./ThemeSelector";
import Encabezado from "../ui/Encabezado";
import { Bell } from "lucide-react";

export default function Header() {
    const { newNotification, setNewNotification } = useMessageStore( state => state );

    return (
        <Encabezado>
            <div className="flex items-center gap-3">
                <Menu />
                <Title link="/"/>
            </div>

            <div className="flex gap-1">
                <ThemeSelector />

                <Link 
                    to="/notifications"
                    className="hidden md:flex items-center justify-center size-9 rounded hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
                    onClick={() => setNewNotification(false)}
                >
                    <Bell className="h-5 w-5" />
                    { newNotification && 
                        <div className="w-3 h-3 rounded-full bg-primary animate-pulse -translate-y-3 -translate-x-2" />
                    }
                    <span className="sr-only">Notificaciones</span>
                </Link>     
            </div>
        </Encabezado>
    )
}