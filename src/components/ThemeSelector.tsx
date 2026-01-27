import { Moon, Palette, Sun } from "lucide-react";
import { Content, Item, Portal, Root, Trigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/Button";
import { useAppStore } from "../store/appStore";

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
        <Root>
            <Trigger asChild>
                <Button variant="ghost" size="icon" className="flex items-center justify-center">
                    <Palette className="h-5 w-5" />
                    <span className="sr-only">Seleccionar tema</span>
                </Button>                
            </Trigger>

            <Portal>
                <Content 
                    align="end"
                    forceMount
                    className="bg-popover/60 backdrop-blur-lg text-popover-foreground min-w-32 w-56 rounded-lg border p-1 shadow-md z-50 max-h-(--radix-dropdown-menu-content-available-height) origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto fade-in"
                >
                    { themes.map(t => (
                        <Item
                            key={t.value}
                            onClick={() => setTheme(t.value)}
                            className="flex items-center gap-3 cursor-pointer px-2 py-1 hover:bg-foreground/10"
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
                        </Item>
                    ))}
                </Content>
            </Portal>
        </Root>
    )
}