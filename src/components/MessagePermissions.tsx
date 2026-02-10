import { Camera, CameraOff, MapPin, MapPinOff, Mic, MicOff } from "lucide-react";
import type { PermissionKey } from "../types";

type MessagePermissionsProps = {
    permiso: PermissionKey;
    estado: Extract<PermissionState, "denied" | "prompt">;
}

export default function MessagePermissions({ permiso, estado }: MessagePermissionsProps) {
    return (
        <div className="space-y-3 p-1">
            <div className="flex gap-3 items-center">
                <div className="h-7 w-7">
                    {permisos[permiso][estado].icono}
                </div>
                
                <div>
                    <p className="font-semibold text-foreground">{permisos[permiso][estado].titulo}</p>
                    <p className="text-xs font-semibold text-muted-foreground">{permisos[permiso][estado].descripcion}</p>
                </div>
            </div>
            
            { estado === "denied" && (
                <div>
                    <p className="text-sm font-semibold text-muted-foreground">
                        <span className="font-bold">Parece que el acceso está bloqueado.</span>{" "}
                        Para poder usar esta función, necesitamos tu permiso. Haz clic en el icono() de la barra de navegación y selecciona "Permitir". Luego, recarga la página.</p>
                </div>
            )}
        </div>
    )
}

const permisos = {
    camera: {
        prompt: {
            titulo: "¿Nos dejas usar tu cámara?",
            descripcion: "Necesitamos acceso para que puedas tomar fotos de los incidentes que deseas reportar",
            icono: <Camera />
        },
        denied: {
            titulo: "Denegaste el uso del micrófono",
            descripcion: "Necesitamos acceso para que puedas tomar fotos de los incidentes que deseas reportar",
            icono: <CameraOff />
        },
    },
    microphone: {
        prompt: {
            titulo: "¿Nos dejas usar tu micrófono?",
            descripcion: "Usamos el micrófono para que puedas describir el incidente mas cómodamente",
            icono: <Mic />
        },
        denied: {
            titulo: "Denegaste el uso del micrófono",
            descripcion: "Usamos el micrófono para que puedas describir el incidente mas cómodamente.",
            icono: <MicOff />
        },
    },
    location: {
        prompt: {
            titulo: "¿Nos dejas usar tu ubicación?",
            descripcion: "Utilizamos tu ubicación para mostrarte los incidentes más cercanos y localizar el incidente que reportas con mayor exactitud",
            icono: <MapPin />
        },
        denied: {
            titulo: "Denegaste el uso del micrófono",
            descripcion: "Utilizamos tu ubicación para mostrarte los incidentes más cercanos y localizar el incidente que reportas con mayor exactitud",
            icono: <MapPinOff />
        },
    }
};