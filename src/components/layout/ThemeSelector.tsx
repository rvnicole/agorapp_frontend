import { useAppStore } from "../../store/appStore";
import { Popover, PopoverContent, PopoverItem, PopoverTrigger } from "../ui/Popover";
import { Button } from "../ui/Button";
import { Moon, Palette, Sun } from "lucide-react";

const themes = [
    {
        name: "Light",
        value: "light",
        description: "Claro básico",
        preview: "bg-white",
        type: "light"
    },
    {
        name: "Dark",
        value: "dark",
        description: "Oscuro básico",
        preview: "bg-zinc-900",
        type: "dark"
    },
    {
        name: "Neon Cyan",
        value: "neon-cyan",
        description: "Oscuro con acentos cyan",
        preview: "bg-gradient-to-r from-cyan-500 to-blue-500",
        type: "dark"
    },
    {
        name: "Neon Magenta",
        value: "neon-magenta",
        description: "Oscuro con acentos magenta",
        preview: "bg-gradient-to-r from-pink-500 to-purple-500",
        type: "dark"
    },
    {
        name: "Cyber Light",
        value: "cyber-light",
        description: "Claro con acentos purple/cyan",
        preview: "bg-gradient-to-r from-purple-400 to-cyan-400",
        type: "light"
    },
    {
        name: "Tron Light",
        value: "tron-light",
        description: "Claro estilo Tron",
        preview: "bg-gradient-to-r from-blue-400 to-orange-400",
        type: "light"
    },
];

export default function ThemeSelector() {
    const { theme } = useAppStore(state => state);
    const { setTheme } = useAppStore(state => state);

    return (
        <Popover>
            <PopoverTrigger>
                <Button variant="ghost" size="icon" className="flex items-center justify-center">
                    <Palette className="h-5 w-5" />
                    <span className="sr-only">Seleccionar tema</span>
                </Button>                
            </PopoverTrigger>

            <PopoverContent>
                { themes.map(t => (
                    <PopoverItem
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                    >
                        <div
                            className={`flex items-center justify-center h-6 w-6 rounded ${t.preview} ring-2 ring-offset-2 ${theme === t.value ? "ring-primary" : "ring-transparent"}`}
                        >
                            { t.type === "light" ? <Sun className={`h-5  w-5 ${t.value === "light" ? "text-zinc-900" : "text-white"}`} /> : <Moon className="h-5  w-5 text-white" /> }                               
                        </div>

                        <div className="flex flex-col">
                            <span className="font-medium">{t.name}</span>
                            <span className="text-xs text-muted-foreground">{t.description}</span>
                        </div>
                    </PopoverItem>
                ))}
            </PopoverContent>
        </Popover>
    )
}