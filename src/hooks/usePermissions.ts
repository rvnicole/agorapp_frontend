import { useState } from "react";
import { permissionsStatus } from "../services/permissions/permissionsStatus";
import { requestCamera, requestLocation, requestMicrophone } from "../services/permissions/requestPermissions";
import type { PermissionKey, Permissions } from "../types";

export function usePermissions() {
    const [status, setStatus] = useState<Permissions | null>(null);
    const [isChecking, setIsChecking] = useState(true);
    const [loading, setLoading] = useState(false);

    const hasAllGranted = !isChecking && status && Object.values(status).every(p => p === "granted");
    const hasAnyDenied = !isChecking && status && Object.values(status).some(p => p === "denied");

    const check = async () => {
        setIsChecking(true);
        const res = await permissionsStatus();
        console.log(res);
        setStatus(res);
        setIsChecking(false);
        return res;
    };

    const request = async (permiso: PermissionKey) => {
        setLoading(true);
        let res;

        if(permiso === "camera") {
            res = await requestCamera();
        }
        else if(permiso === "microphone") {
            res = await requestMicrophone();
        } 
        else if(permiso === "location") {
            res = await requestLocation();
        }

        setLoading(false);
        await check();

        return res;
    };

    return {
        status,
        isChecking,
        loading,
        hasAllGranted,
        hasAnyDenied,
        check,
        request
    }
}