import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/Button";
import { Bell, House, Map, Plus, UserRound } from "lucide-react"

const navItems = [
    { id: "home", link: "/", icon: House, label: "Inicio" },
    { id: "map", link: "/map", icon: Map, label: "Mapa" },
    { id: "create", link: "/create-report", icon: Plus, label: "Crear"},
    { id: "notifications", link: "/notifications", icon: Bell, label: "Notificaciones" },
    { id: "profile", link: "/profile", icon: UserRound, label: "Perfil" },
];

export default function Navbar() {
    const location = useLocation();
    const pathname = location.pathname;
    console.log(pathname)

    return (
        <nav className="fixed block md:hidden bottom-0 left-0 z-40 w-full border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="flex items-center justify-around h-14">
                { navItems.map(item => {
                    const { id, link, icon: Icon, label } = item;
                    return (
                        <div>
                            { id === "create" ?
                                <Button
                                    className="flex items-center justify-center p-3 rounded-full hover:scale-105"
                                    style={{ height: "50px", width: "50px" }}
                                >
                                    <Plus className="h-7 w-7"/>
                                </Button>
                                :
                                <Link
                                    key={id}
                                    to={link}
                                    className={`text-muted-foreground flex flex-col items-center gap-1 mb-1 ${pathname === link ? "text-primary":"group"}`}
                                >
                                    <Icon className="h-5 w-5 group-hover:text-accent" />
                                </Link>
                            }

                            {pathname === link && <div key={label} className="border-t-2 border-primary h-1 rounded-full"/>}
                        </div>
                    )
                })}
            </div>
        </nav>
    )
}