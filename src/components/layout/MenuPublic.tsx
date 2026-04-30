import { Link } from "react-router-dom";
import { Slidemenu, SlidemenuClose, SlidemenuContent, SlidemenuDescription, SlidemenuTitle, SlidemenuTrigger } from "../ui/Slidemenu";
import Avatar from "../ui/Avatar";
import { MenuIcon, X } from "lucide-react";


export default function MenuPublic(){
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

                <Link to="/auth/login" className="flex items-center gap-2 px-2 py-5 hover:bg-muted">
                    <Avatar className="size-12">
                        <img src="/public/user-avar-default.jpg" className="w-full h-fit"/>
                    </Avatar>

                    <div>
                        <p className="font-semibold">Nuevo usuario</p>
                        <p className="bg-primary text-primary-foreground text-xs px-2 w-fit rounded-full">Iniciar Sesión</p>
                    </div>                    
                </Link>                
            </SlidemenuContent>
        </Slidemenu>
    )
}