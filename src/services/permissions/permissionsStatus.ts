import type { Permissions } from "../../types";
import { requestCamera, requestLocation, requestMicrophone } from "./requestPermissions";

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
    const status = await getStatusPermission("camera" as PermissionName);

    if( status === "granted" ) {
        const res = await requestCamera();
        return res.success ? "granted" : "denied";
    }

    return status;
}

export const getStatusMicrophone = async () => {
    const status = await getStatusPermission("microphone" as PermissionName);

    if(status === "granted" ) {
        const res = await requestMicrophone();
        return res.success ? "granted" : "denied";
    }

    return status;
}

export const getStatusLocation = async () => {
    const status = await getStatusPermission("geolocation" as PermissionName);

    if( status === "granted" ) {
        const res = await requestLocation();
        return res.success ? "granted" : "denied";
    }

    return status;
}

export async function permissionsStatus(): Promise<Permissions> {
    return {
        camera: await getStatusCamera(), 
        microphone: await getStatusMicrophone(),
        location: await getStatusLocation(),
    };
}