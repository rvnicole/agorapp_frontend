import { useState } from "react";
import { permissionsStatus } from "../services/permissions/permissionsStatus";
import { permissionsFlow } from "../services/permissions/permissionsFlow";
import type { Permissions } from "../types";

export function usePermissions() {
    const [status, setStatus] = useState<Permissions | null>(null);
    const [loading, setLoading] = useState(false);

    const hasAllGranted = status && Object.values(status).every(p => p === "granted");
    const hasAnyDenied = status && Object.values(status).some(p => p === "denied");

    const check = async () => {
        const res = await permissionsStatus();
        setStatus(res);
        return res;
    };

    const request = async () => {
        setLoading(true);
        const res = await permissionsFlow();
        setLoading(false);
    
        if (res?.success) {
            setStatus(res.data);
        }
    
        return res;
    };

    return {
        status,
        loading,
        hasAllGranted,
        hasAnyDenied,
        check,
        request
    }
}