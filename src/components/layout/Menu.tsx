import { useUserStore } from "../../store/userStore";
import { Link, useLocation } from "react-router-dom";
import { Slidemenu, SlidemenuClose, SlidemenuContent, SlidemenuDescription, SlidemenuTitle, SlidemenuTrigger } from "../ui/Slidemenu";
import Avatar from "../ui/Avatar";
import { House, LogOut, Map, MenuIcon, X } from "lucide-react";
import Logout from "./Logout";

const menuItems = [
    { id: "home", link: "/", icon: House, label: "Inicio" },
    { id: "map", link: "/map", icon: Map, label: "Mapa" }
];

export default function Menu(){
    const { user } = useUserStore( state => state );

    const location = useLocation();
    const pathname = location.pathname;

    return (
        <Slidemenu>
            <SlidemenuTrigger 
                className="flex items-center justify-center size-9 transition-all cursor-pointer rounded hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
            >
                <MenuIcon className="h-4 w-4" />
                <span className="sr-only">Seleccionar Opcion</span>
            </SlidemenuTrigger>

            <SlidemenuContent side="left">
                <div className="flex items-start justify-between p-2">
                    <div>
                        <SlidemenuTitle className="text-lg font-bold">AgorApp</SlidemenuTitle>
                        <SlidemenuDescription className="text-sm text-muted-foreground font-semibold">Menú</SlidemenuDescription> 
                    </div>  

                    <SlidemenuClose className="flex justify-end cursor-pointer">
                        <div className="p-1 bg-primary rounded-full">
                            <X className="h-5 w-5 text-primary-foreground"/> 
                        </div>
                    </SlidemenuClose>
                </div>         

                <Link to="/profile" className="flex items-center gap-2 px-2 py-5 hover:bg-muted">
                    <Avatar className="size-12">
                        <img src={user.url_img || "/public/user-avar-default.jpg"} className="w-full h-fit"/>
                    </Avatar>

                    <div>
                        <p className="font-semibold">{user.alias}</p>
                        { user.rol && <p className="bg-primary text-primary-foreground text-xs px-2 w-fit rounded-full">{user.rol}</p>}
                    </div>                    
                </Link>

                { menuItems.map(item => {
                    const { id, link, icon:Icon, label } = item;

                    return (
                        <Link
                            key={id}
                            to={link} 
                            className={`flex items-center gap-2 p-2 hover:bg-muted ${pathname === link && "text-primary border-primary border-l-4"}`}
                        >
                            <Icon className="h-5 w-5"/>
                            <span>{label}</span>
                        </Link>
                    )
                })}

                <Logout className="absolute bottom-0 p-2 w-full hover:bg-muted">
                    <LogOut className="h-5 w-5"/>
                    <span>Cerrar sesión</span>
                </Logout>
            </SlidemenuContent>
        </Slidemenu>
    )
}