import { Camera, CameraOff, MapPin, MapPinOff, Mic, MicOff, Lock } from "lucide-react";
import type { PermissionKey, PermissionState } from "../../types";

type MessagePermissionsProps = {
    permiso: PermissionKey;
    estado: PermissionState;
}

export default function MessagePermissions({ permiso, estado }: MessagePermissionsProps) {
    if ( estado === "denied" || estado === "prompt" ) return (
        <div className="space-y-3 p-3">
            <div className="flex gap-3 items-center justify-center">
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
                    <div className="text-sm font-semibold text-muted-foreground">
                        <span className="font-bold">Parece que el acceso está bloqueado.</span>{" "}
                        Para poder usar esta función, necesitamos tu permiso. Haz clic en el icono (
                        <Lock className="inline size-4" /> ,
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="inline size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                        </svg>
                        ) de la barra de navegación y selecciona "Permitir". Luego, recarga la página.
                    </div>
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
            titulo: "Denegaste el uso de la cámara",
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
            titulo: "Denegaste el uso de la ubicación",
            descripcion: "Utilizamos tu ubicación para mostrarte los incidentes más cercanos y localizar el incidente que reportas con mayor exactitud",
            icono: <MapPinOff />
        },
    }
};