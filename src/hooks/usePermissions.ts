import { useState } from "react";
import { permissionsStatus } from "../services/permissions/permissionsStatus";
import { permissionsFlow } from "../services/permissions/permissionsFlow";
import type { Permissions } from "../types";

export function usePermissions() {
    const [status, setStatus] = useState<Permissions | null>(null);
    const [isChecking, setIsChecking] = useState(true);
    const [loading, setLoading] = useState(false);

    const hasAllGranted = !isChecking && status && Object.values(status).every(p => p === "granted");
    const hasAnyDenied = !isChecking && status && Object.values(status).some(p => p === "denied");

    const check = async () => {
        setIsChecking(true);
        const res = await permissionsStatus();
        setStatus(res);
        setIsChecking(false);
        return res;
    };

    const request = async () => {
        setLoading(true);
        const res = await permissionsFlow();
        setLoading(false);
    
        const updated = await permissionsStatus();
        setStatus(updated);
    
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