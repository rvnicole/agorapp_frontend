import { useMessageStore } from "../../store/messageStore";
import { useUserStore } from "../../store/userStore";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/Button";
import { Bell, House, Map, Plus, UserRound } from "lucide-react"
import { useAuthModalStore } from "../../store/authModalStore";

const navItems = [
    { id: "home", link: "/", icon: House, label: "Inicio" },
    { id: "map", link: "/map", icon: Map, label: "Mapa" },
    { id: "create", link: "/create-report", icon: Plus, label: "Crear"},
    { id: "notifications", link: "/notifications", icon: Bell, label: "Notificaciones" },
    { id: "profile", link: "/profile", icon: UserRound, label: "Perfil" },
];

type NavbarProps = {
    onCreate: () => void;
}

export default function Navbar({ onCreate }: NavbarProps) {
    const { newNotification, setNewNotification } = useMessageStore( state => state );
    const { setOpenModal, setAction } = useAuthModalStore( state => state );
    const { user: { alias }} = useUserStore( state => state );

    const location = useLocation();
    const pathname = location.pathname;

    const handleClickPublic = () => {
        setOpenModal(true);
        setAction("default");
    }

    return (
        <nav className="fixed block md:hidden bottom-0 left-0 z-40 w-full border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="flex items-center justify-around h-14">
                { navItems.map(item => {
                    const { id, link, icon: Icon, label } = item;
                    return (
                        <div key={id}>
                            { id === "create" ?
                                <Button
                                    className="flex items-center justify-center p-3 rounded-full hover:scale-105"
                                    style={{ height: "50px", width: "50px" }}
                                    onClick={onCreate}
                                >
                                    <Plus className="h-7 w-7"/>
                                </Button>
                                :
                                alias ?
                                    <>
                                        <Link
                                            to={link}
                                            className={`text-muted-foreground flex flex-col items-center gap-1 mb-1 ${pathname === link ? "text-primary":"group"}`}
                                            onClick={() => id === "notifications" ? setNewNotification(false) : null }
                                        >
                                            <div className="flex justify-center items-center">
                                                <Icon className="size-6 group-hover:text-accent"/>
                                                {
                                                    newNotification && id === "notifications" &&
                                                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse -translate-y-3 -translate-x-2"></div>
                                                }
                                            </div>
                                        </Link>

                                        {pathname === link && <div key={label} className="border-t-2 border-primary h-1 rounded-full"/>}
                                    </>
                                    :
                                    <button
                                        type="button"
                                        className={`text-muted-foreground flex flex-col items-center gap-1 mb-1 cursor-pointer ${pathname === link ? "text-primary":"group"}`}
                                        onClick={handleClickPublic}
                                    >
                                        <Icon className="size-6 group-hover:text-accent"/>
                                    </button>
                            }
                        </div>
                    )
                })}
            </div>
        </nav>
    )
}