export async function requestCamera() {
    try {
        const res = await navigator.mediaDevices.getUserMedia({
            video: true
        });
        
        if( res.active ) {
            return { success: true, data: res }
        }
    }
    catch( error ) {
        console.log("Permissions Camera Error:", error);
        return { success: false, error: "No se pudo acceder a la cámara" };
    }
};

export async function requestMicrophone() {
    try {
        const res = await navigator.mediaDevices.getUserMedia({
            audio: true
        });
        
        if( res.active ) {
            return { success: true, data: res }
        }
    }
    catch( error ) {
        console.log("Permissions Microphone Error:", error);
        return { success: false, error: "No se pudo acceder al micrófono" };
    }
};

export async function requestLocation() {
    await navigator.geolocation.getCurrentPosition(
        (data) => {
            return { success: true, data }
        }, 
        (error) => {
            console.log("Permissions Location Error:", error);
            return { success: false, error: "No se pudo acceder a la ubicación" };
        }
    );
}