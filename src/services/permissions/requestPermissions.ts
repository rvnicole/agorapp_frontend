import type { Result } from "../../types";

export async function requestCamera(): Promise<Result> {
    try {
        const res = await navigator.mediaDevices.getUserMedia({
            video: true
        });
        
        return { success: true, data: res }
    }
    catch( error ) {
        console.log("Permissions Camera Error:", error);
        return { success: false, error: "No se pudo acceder a la cámara" };
    }
};

export async function requestMicrophone(): Promise<Result> {
    try {
        const res = await navigator.mediaDevices.getUserMedia({
            audio: true
        });
        
        return { success: true, data: res }
        
    }
    catch( error ) {
        console.log("Permissions Microphone Error:", error);
        return { success: false, error: "No se pudo acceder al micrófono" };
    }
};

export async function requestLocation(): Promise<Result> {
    return new Promise(resolve => {
        navigator.geolocation.getCurrentPosition(
            ( data) => {
                resolve({ success: true, data });
            }, 
            (error) => {
                console.log("Permissions Location Error:", error);
                resolve({ success: false, error: "No se pudo acceder a la ubicación" });
            }
        )
    });
}