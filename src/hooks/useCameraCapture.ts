import { useRef, useState } from "react";

export default function useCameraCapture() {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const openCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" }
            });
        
            if (videoRef.current) {
                videoRef.current.hidden = false;
                videoRef.current.srcObject = mediaStream;
            }
        
            setStream(mediaStream);
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
        
        const width = videoRef.current.videoWidth;
        const height = videoRef.current.videoHeight;
        
        canvasRef.current.width = width;
        canvasRef.current.height = height;

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
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
      
        if (videoRef.current) {
            videoRef.current.hidden = true;
            videoRef.current.srcObject = null;
        }
      
        setStream(null);
        setIsOpen(false);
    };
      

    return {
        isOpen,
        videoRef,
        canvasRef,
        openCamera,
        capture,
        closeCamera
    }
}