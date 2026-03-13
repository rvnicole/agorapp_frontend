import { useEffect, useRef, useState } from "react";
import { requestCamera } from "../services/permissions/requestPermissions";

export function useCameraCapture() {
    const [isOpen, setIsOpen] = useState(false);

    const stream = useRef<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        return () => closeCamera();
    }, []);

    useEffect(() => {
        if (isOpen && videoRef.current && stream.current) {
            videoRef.current.srcObject = stream.current;
            videoRef.current.play().catch(() => {});
        }
    }, [isOpen]);

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

        closeCamera();

        return new Promise(resolve => {
            canvasRef.current!.toBlob( blob => {
                if (!blob) return resolve(null);

                

                resolve(new File([blob], `foto-${Date.now()}.png`, { type: blob.type }));
            }, "image/png");
        });      
    }

    const closeCamera = () => {
        if (videoRef.current) {
            const tracks = videoRef.current.srcObject as MediaStream;
            tracks.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
            videoRef.current.pause();
        }
        
        if (stream.current) {
            stream.current.getTracks().forEach(track => track.stop());
            stream.current = null;
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