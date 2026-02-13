import type { ResultPermission } from "../../types";

export async function requestCamera(): Promise<ResultPermission> {
    try {
        const res = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "environment"
            }
        });
        
        return { success: true, data: res }
    }
    catch( error: any ) {
        console.log("Permissions Camera Error:", error);

        switch (error.name) {
            case "NotAllowedError":
                return { success: false, error: "PERMISSION_DENIED" };

            case "NotFoundError":
                return { success: false, error: "DEVICE_NOT_FOUND" };

            case "NotReadableError":
                return { success: false, error: "DEVICE_BUSY" };

            case "AbortError":
                return { success: false, error: "REQUEST_ABORTED" };

            default:
                return { success: false, error: "UNKNOWN_ERROR" };
        }
    }
};

export async function requestMicrophone(): Promise<ResultPermission> {
    try {
        const res = await navigator.mediaDevices.getUserMedia({
            audio: true
        });
        
        return { success: true, data: res }
        
    }
    catch( error: any ) {
        console.log("Permissions Microphone Error:", error);
        
        switch (error.name) {
            case "NotAllowedError":
                return { success: false, error: "PERMISSION_DENIED" };

            case "NotFoundError":
                return { success: false, error: "DEVICE_NOT_FOUND" };

            case "NotReadableError":
                return { success: false, error: "DEVICE_BUSY" };

            case "AbortError":
                return { success: false, error: "REQUEST_ABORTED" };

            default:
                return { success: false, error: "UNKNOWN_ERROR" };
        }
    }
};

export async function requestLocation(): Promise<ResultPermission> {
    return new Promise(resolve => {
        navigator.geolocation.getCurrentPosition(
            ( data) => {
                resolve({ success: true, data });
            }, 
            (error) => {
                console.log("Permissions Location Error:", error);
                
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        resolve({ success: false, error: "PERMISSION_DENIED" });
                        break;

                    case error.POSITION_UNAVAILABLE:
                        resolve({ success: false, error: "POSITION_UNAVAILABLE" });
                        break;

                    case error.TIMEOUT:
                        resolve({ success: false, error: "TIMEOUT" });
                        break;

                    default:
                        resolve({ success: false, error: "UNKNOWN_ERROR" });
                }
            },
            {
                enableHighAccuracy: true, // Ubicación exacta
                timeout: 10000, // Tiempo maximo de espera
                maximumAge: 0 // Siempre la ubicación actual (No cache)
            }
        )
    });
}