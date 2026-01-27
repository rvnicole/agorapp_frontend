import { CircleCheck, CircleX, Info, TriangleAlert, X } from "lucide-react";
import { useAppStore } from "../../store/appStore";

const iconos = {
    success: {
        icono: CircleCheck,
        color: "text-lime-500"
    },
    error: {
        icono: CircleX,
        color: "text-red-500"
    },
    info: {
        icono: Info,
        color: "text-blue-500"
    },
    warning: {
        icono: TriangleAlert,
        color: "text-amber-500"
    }
}

export default function Message() {
    const { messages, removeMessages } = useAppStore(state => state);

    return (
        <div className="fixed bottom-4 right-4 space-y-2 z-50">
            { messages.map((m) => {
                const Icono = iconos[m.type].icono;
                const color = iconos[m.type].color;

                return (
                    <div
                        key={m.id}
                        className="p-4 max-w-64 flex items-center justify-between gap-2 rounded-lg border bg-popover/60 backdrop-blur-lg shadow-sm hover:scale-105 fade-in"
                    >
                        <div className="w-10 h-10 flex items-center justify-cente">
                            <Icono className={color} />
                        </div>

                        <span className="text-popover-foreground text-sm select-none">{m.text}</span>
                        
                        <button
                            className="p-1 text-popover-foreground cursor-pointer rounded-full hover:text-primary hover:bg-popover-foreground/10"
                            onClick={() => removeMessages(m.id)}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )
            })}
        </div>
    )
}