import { useEffect, useState } from "react";
import { useAppStore } from "../../store/appStore";
import { useCameraCapture } from "../../hooks/useCameraCapture";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import FullScreen from "../ui/FullScreen";
import Spinner from "../ui/Spinner";
import PreviewImg from "./PreviewImg";
import { ArrowRight, Camera, ImagePlus } from "lucide-react";
import type { ImagenPreview } from "../../types";

export default function CapturedImgs() {
    const { stream, isOpen, videoRef, canvasRef, openCamera, capture, closeCamera } = useCameraCapture();

    const [ imgs, setImgs ] = useState<ImagenPreview []>([]);
    const [ view, setView ] = useState<"loading" | "camera" | "preview">("loading");

    const { showMessages } = useAppStore(state => state);
    const navigate = useNavigate();

    useEffect(() => {   
        startCamera();
    }, []);

    useEffect(() => {
        if (view !== "camera") return;
        if (!videoRef.current) return;
      
        videoRef.current.srcObject = stream.current;
        videoRef.current.play();
    }, [view]);

    const startCamera = async () => {
        setView("loading");
        const res = await openCamera();

        if (!res.success && res.error ) {
            showMessages("error", res.error);
            navigate("/");
        }

        setView("camera");
    };    

    const handleCaptureImg = async () => {
        const file = await capture();
        if( !file ) {
            showMessages("error", "No se pudo capturar la imagen");
            return;
        };

        setImgs(i => ([ ...i, { 
            imagen: file, 
            url: URL.createObjectURL(file) 
        }]));

        setView("preview");
    }

    const handleRemoveImg = (id: string) => {
        setImgs(prev => {
            const img = prev.find(i => `${i.imagen.name}-${i.imagen.lastModified}` === id);

            if( img ) {
                URL.revokeObjectURL(img.url);
            }
          
            return prev.filter(i => `${i.imagen.name}-${i.imagen.lastModified}` !== id);
        });
    }

    return (
        <FullScreen
            open={true}
            onClose={() => console.log("Cerrando")}
        >
            { view === "loading" && <Spinner /> }

            { view === "camera"  &&
                <>
                    <canvas ref={canvasRef} className="h-full" hidden />

                    <video 
                        id="capture-imgs" 
                        ref={videoRef}
                        className="absolute top-0 left-1/2 -translate-x-1/2 h-full object-cover" 
                        autoPlay 
                    />

                    <Button
                        type="button"
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center h-16 w-16 rounded-full"
                        onClick={handleCaptureImg}
                    >
                        <Camera className="h-6 w-6"/>
                    </Button>
                </> 
            }

            { view === "preview" && (
                <div>
                    <div className="flex flex-col md:flex-row gap-3">
                        { imgs.map((img, index) => 
                            <div key={`foto-${index}`} className="w-52">
                                <PreviewImg
                                    img={img}
                                    onRemove={handleRemoveImg}
                                /> 
                            </div>
                        )}
                    </div>

                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-2 flex gap-2 flex-col w-full md:flex-row md:w-md">
                        { imgs.length < 3 &&   
                            <Button
                                type="button"
                                variant="secondary"
                                className="flex items-center justify-center gap-1 w-full"
                                onClick={startCamera}
                            >
                                <ImagePlus className="h-5 w-5"/>
                                Añadir foto
                            </Button>
                        }

                        <Button
                            type="button"
                            className="flex items-center justify-center gap-1 w-full"
                            onClick={() => console.log("siguiente")}
                        >
                            Siguiente
                            <ArrowRight className="h-5 w-5"/>
                        </Button>
                    </div>
                </div>
            )}
        </FullScreen> 
    )
}