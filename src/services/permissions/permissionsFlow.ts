import { AgorAppError } from "../../errors/ApiError";
import { permissionsStatus } from "./permissionsStatus";
import { requestCameraAndMic, requestLocation } from "./requestPermissions";
import type { Permissions } from "../../types";

type PermissionsResult = { success: true, data: Permissions } | { success: false, errors: string[] };

export async function permissionsFlow(): Promise<PermissionsResult | undefined> {  
    const status = await permissionsStatus();
    const errors = [];
  
    try {
        if (status.camera !== "granted" || status.microphone !== "granted") {
            try {
                await requestCameraAndMic();
            }
            catch(error) {
                console.log("Permissions Error: ", error);
                errors.push("cámara");
                errors.push("micrófono");
            }                
        }
  
        if (status.location !== "granted") {
            try {
                await requestLocation();
            }
            catch(error) {
                console.log("Permissions Error: ", error);
                errors.push("ubicación");
            }                
        }
  
        if( errors.length ) {
            throw new AgorAppError(errors);
        }
        
        const finalStatus = await permissionsStatus();
        return { success: true, data: finalStatus };
    } 
    catch (error) {
        if (error instanceof AgorAppError) {
            return { success: false, errors: [...error.messages]};
        }
        
        // Error desconocido
        console.log("Permissions Error: ", error);
    }
}
  