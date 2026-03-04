import { useRef, useState } from "react";
import { requestCamera } from "../services/permissions/requestPermissions";

export function useCameraCapture() {
    const [isOpen, setIsOpen] = useState(false);
    const stream = useRef<MediaStream | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const openCamera = async () => {
        try {
            const res = await requestCamera();
            stream.current = res.data;
            setIsOpen(true);

            return { success: true };
        }
        catch( error ) {
            console.log("Error: ", error);
            return { success: false, error: "No se pudo acceder a la camara." };
        }
    }
        
    const capture = async (): Promise<File | null> => {
        if( !canvasRef.current || !videoRef.current ) return null
        
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;

        const ctx = canvasRef.current.getContext("2d");
        if( !ctx ) return null;

        ctx.drawImage(videoRef.current, 0, 0);

        return new Promise(resolve => {
            canvasRef.current!.toBlob( blob => {
                if (!blob) return resolve(null);

                closeCamera();

                resolve(new File([blob], `foto-${Date.now()}.png`, { type: blob.type }));
            }, "image/png");
        });      
    }

    const closeCamera = () => {
        if (stream.current) {
            stream.current.getTracks().forEach(track => track.stop());
            stream.current = null;
        }
      
        if (videoRef.current) {
            videoRef.current.hidden = true;
            videoRef.current.srcObject = null;
        }

        setIsOpen(false);
    };
      

    return {
        stream,
        isOpen,
        videoRef,
        canvasRef,
        openCamera,
        capture,
        closeCamera
    }
}