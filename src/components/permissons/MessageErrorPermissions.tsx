import { CameraOff, MapPinOff, MicOff } from "lucide-react";
import type { PermissionKey, PermissionsError } from "../../types";

type MessageErrorPermissions = {
    permiso: PermissionKey;
    error: PermissionsError
}

export default function MessageErrorPermissions({ permiso, error }: MessageErrorPermissions) {
    const { titulo, descripcion } = getMessageError({ permiso, error });
    const icono = permiso === "camera" ? <CameraOff /> :
                    permiso === "microphone" ? <MicOff /> : <MapPinOff />

    return (
        <div className="space-y-3 p-3">
            <div className="flex gap-3 items-center justify-center">
                <div className="h-7 w-7">
                    {icono}
                </div>
                
                <div>
                    <p className="font-semibold text-foreground">{titulo}</p>
                    <p className="text-xs font-semibold text-muted-foreground">{descripcion}</p>
                </div>
            </div>
        </div>
    )
}

function getMessageError({ permiso, error }: MessageErrorPermissions): { titulo: string, descripcion: string } {
    let titulo;

    switch(error) {
        case "PERMISSION_DENIED":
            titulo = permiso === "camera" ? "Denegaste el uso de la cámara" : 
                        permiso === "microphone" ? "Denegaste el uso del micrófono" : "Denegaste el uso de la ubicación";

            return {
                titulo,
                descripcion: 'Para poder usar esta función, necesitamos tu permiso. Haz clic en el icono de la barra de navegación y selecciona "Permitir". Luego, recarga la página.'
            }
        case "DEVICE_NOT_FOUND":
            titulo = permiso === "camera" ? 
                    "No se encontró  disponible una cámara" :  
                    "No se encontró  disponible un micrófono" ;

            return {
                titulo,
                descripcion: "Conecta un dispositivo o verifica que esté habilitado en tu equipo"
            };
        case "DEVICE_BUSY":
            titulo = permiso === "camera" ? 
                    "La cámara está siendo usada por otra aplicación" :  
                    "El micrófono está siendo usado por otra aplicación" ;

            return {
                titulo,
                descripcion: "Cierra otras apps que los estén usando e inténtalo de nuevo"
            };
        case "REQUEST_ABORTED":
            return {
                titulo: "La solicitud fue cancelada",
                descripcion: "Intenta nuevamente y no cierres la ventana durante el proceso"
            };
        case "POSITION_UNAVAILABLE":
            return {
                titulo: "No pudimos obtener tu ubicación en este momento",
                descripcion: "Verifica que el GPS esté activado y tengas buena señal"
            };
        case "TIMEOUT":
            return {
                titulo: "No se puede obtener la ubicación",
                descripcion: "Intenta nuevamente en un lugar con mejor señal"
            };
        case "UNKNOWN_ERROR":
            return {
                titulo: "Ocurrió un problema",
                descripcion: "Intenta nuevamente, actualiza la página o revisa la configuración de tu dispositivo"
            };
        default:
            return {
                titulo: "Ocurrió un problema",
                descripcion: "Intenta nuevamente, actualiza la página o revisa la configuración de tu dispositivo"
            };
    }
}