import type { Permissions } from "../../types";

export async function permissionsStatus(): Promise<Permissions> {
    
    const safeQuery = async (name: PermissionName) => {
        try {
            const result = await navigator.permissions.query({ name });
            return result.state;
        } 
        catch {
            return "unknown";
        }
    };

    return {
        camera: await safeQuery("camera" as PermissionName),
        microphone: await safeQuery("microphone" as PermissionName),
        location: await safeQuery("geolocation"),
    };
}