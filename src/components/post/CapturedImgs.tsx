import { useEffect, useState } from "react";
import { useAppStore } from "../../store/appStore";
import { useCameraCapture } from "../../hooks/useCameraCapture";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import FullScreen from "../ui/FullScreen";
import Spinner from "../ui/Spinner";
import PreviewImg from "./PreviewImg";
import { Camera, ImagePlus } from "lucide-react";
import type { ImagenPreview } from "../../types";

export default function CapturedImgs() {
    const [ imgs, setImgs ] = useState<ImagenPreview []>([]);
    const [ showPreview, setShowPreview ] = useState<boolean>(false);
    const { showMessages } = useAppStore(state => state);
    const { isOpen, videoRef, canvasRef, openCamera, capture, closeCamera } = useCameraCapture();
    const navigate = useNavigate();

    useEffect(() => {
        const startCamera = async () => {
            const res = await openCamera();
    
            if (!res.success && res.error ) {
                showMessages("error", res.error);
                navigate("/");
            }
        };    
        startCamera();
    }, []);
    

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

        setShowPreview(true);
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
            { !isOpen && !showPreview && <Spinner /> }

            <canvas 
                ref={canvasRef} 
                className="h-full"
                hidden 
            />

            <video 
                id="capture-imgs" 
                ref={videoRef}
                className="absolute top-0 left-1/2 -translate-x-1/2 h-full object-cover"
                hidden={!isOpen} 
                autoPlay 
            />

            <Button
                type="button"
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center h-16 w-16 rounded-full"
                onClick={handleCaptureImg}
                hidden={!isOpen} 
            >
                <Camera className="h-6 w-6"/>
            </Button>

            { showPreview && (
                <>
                    <div className="flex">
                        { imgs.map( img => 
                            <div className="w-60">
                                <PreviewImg 
                                    img={img}
                                    onRemove={handleRemoveImg}
                                /> 
                            </div>
                        )}
                    </div>

                    <Button
                        type="button"
                        size="lg"
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1"
                    > 
                        <ImagePlus className="h-5 w-5"/>
                        Tomar otra foto
                    </Button>
                </>
            )}
        </FullScreen> 
    )
}