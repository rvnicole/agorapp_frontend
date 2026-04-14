import { Link } from "react-router-dom";
import ThemeSelector from "./ThemeSelector";
import Menu from "./Menu";
import { Bell } from "lucide-react";

export default function Header() {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="flex h-14 items-center justify-between px-4">                
                <div className="flex items-center gap-3">
                    <Menu />

                    <h1 className="text-xl font-bold">
                        <Link to="/">
                            AgorApp
                        </Link>
                    </h1>
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
            </div>
        </header>
    )
}