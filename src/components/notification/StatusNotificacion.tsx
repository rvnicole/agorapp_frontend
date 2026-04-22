import { Check } from "lucide-react";
import type { Notification } from "../../types";

type StatusNotificacionProps = {
    leido: Notification["leido"];
}

export default function StatusNotificacion({ leido }: StatusNotificacionProps) {
    return (
        <div>
            { leido ?
                <div className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-muted-foreground"/>
                    <p className="text-xs text-muted-foreground">Leido</p>
                </div>
                :
                <div className="bg-primary h-2.5 w-2.5 rounded-full cursor-pointer"/>
            }
        </div>
    )
}