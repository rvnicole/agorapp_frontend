import { Camera, CameraOff, MapPin, MapPinOff, Mic, MicOff } from "lucide-react";
import type { Permissions } from "../types";


export default function MessagePermissions({ camera, microphone, location }: Permissions) {
    return (
        <div className="space-y-3 p-1">
            { camera === "prompt" && (
                <SectionPermission
                    titulo="¿Nos dejas usar tu cámara?"
                    descripcion="Necesitamos acceso para que puedas tomar fotos de los incidentes que deseas reportar"
                    icono={<Camera />}
                />
            )}

            { microphone === "prompt" && (
                <SectionPermission
                    titulo="¿Nos dejas usar tu micrófono?"
                    descripcion="Usamos el micrófono para que puedas describir el incidente mas cómodamente"
                    icono={<Mic />}
                />
            )}

            { location === "prompt" && (
                <SectionPermission
                    titulo="¿Nos dejas usar tu ubicación?"
                    descripcion="Utilizamos tu ubicación para mostrarte los incidentes más cercanos y localizar el incidente que reportas con mayor exactitud"
                    icono={<MapPin />}
                />
            )}

            { camera === "denied" && (
                <SectionPermission
                    titulo="Denegaste el uso de la cámara"
                    descripcion="Necesitamos acceso para que puedas tomar fotos de los incidentes que deseas reportar"
                    icono={<CameraOff />}
                />
            )}

            { microphone === "denied" && (
                <SectionPermission
                    titulo="Denegaste el uso del micrófono"
                    descripcion="Usamos el micrófono para que puedas describir el incidente mas cómodamente."
                    icono={<MicOff />}
                />
            )}

            { location === "denied" && (
                <SectionPermission
                    titulo="Denegaste el uso de la ubicación?"
                    descripcion="Utilizamos tu ubicación para mostrarte los incidentes más cercanos y localizar el incidente que reportas con mayor exactitud"
                    icono={<MapPinOff />}
                />
            )}

            { (camera === "denied" || microphone === "denied" || location === "denied") && (
                <div>
                    <p className="text-sm font-semibold text-muted-foreground">
                        <span className="font-bold">Parece que el acceso está bloqueado.</span>{" "}
                        Para poder usar esta función, necesitamos tu permiso. Haz clic en el icono de la barra de navegación y selecciona "Permitir". Luego, recarga la página.</p>
                </div>
            )}
        </div>
    )
}

type SectionPermissionProps = {
    titulo: string;
    descripcion: string;
    icono: React.ReactNode
}

function SectionPermission({ titulo, descripcion, icono }: SectionPermissionProps ) {
    return (
        <div className="flex gap-3 items-center">
            <div className="h-7 w-7">
                {icono}
            </div>
            
            <div>
                <p className="font-semibold text-foreground">{titulo}</p>
                <p className="text-xs font-semibold text-muted-foreground">{descripcion}</p>
            </div>
        </div>
    )
}