import { Camera, MapPin, Mic } from "lucide-react";
import type { PermissionKey } from "../../types";

const permisos = {
    camera: {
        titulo: "¿Nos dejas usar tu cámara?",
        descripcion: "Necesitamos acceso para que puedas tomar fotos de los incidentes que deseas reportar",
        icono: <Camera />
    },
    microphone: {
        titulo: "¿Nos dejas usar tu micrófono?",
        descripcion: "Usamos el micrófono para que puedas describir el incidente mas cómodamente",
        icono: <Mic />
    },
    location: {
        titulo: "¿Nos dejas usar tu ubicación?",
        descripcion: "Utilizamos tu ubicación para mostrarte los incidentes más cercanos y localizar el incidente que reportas con mayor exactitud",
        icono: <MapPin />
    }
};

type MessagePermissionsProps = {
    permiso: PermissionKey;
}

export default function MessagePermissions({ permiso }: MessagePermissionsProps) {
    const icono = permisos[permiso].icono;
    const titulo = permisos[permiso].titulo;
    const descripcion = permisos[permiso].descripcion;

    return (
        <div className="p-3">
            <div className="flex gap-3 items-center justify-center">
                <div className="h-7 w-7">
                    {icono}
                </div>
                
                <div className="space-y-1">
                    <p className="font-semibold text-foreground">{titulo}</p>
                    <p className="text-xs font-semibold text-muted-foreground">{descripcion}</p>
                </div>
            </div>
        </div>
    )
}