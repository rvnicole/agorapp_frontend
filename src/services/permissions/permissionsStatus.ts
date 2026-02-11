import type { Permissions } from "../../types";

const getStatusPermission = async (name: PermissionName ) => {
    try {
        const result = await navigator.permissions.query({ name });
        return result.state;
    } 
    catch {
        return "unknown";
    }
};

export const getStatusCamera = async () => {
    return await getStatusPermission("camera" as PermissionName);
}

export const getStatusMicrophone = async () => {
    return await getStatusPermission("microphone" as PermissionName);
}

export const getStatusLocation = async () => {
    return await getStatusPermission("geolocation" as PermissionName);
}

export async function permissionsStatus(): Promise<Permissions> {
    return {
        camera: await getStatusCamera(), 
        microphone: await getStatusMicrophone(),
        location: await getStatusLocation(),
    };
}