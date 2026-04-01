import { useEffect, useState } from "react";
import { useMessageStore } from "../../../store/messageStore";
import { useCameraCapture } from "../../../hooks/useCameraCapture";
import { useCameraImagePreview } from "../../../hooks/useCameraImagePreview";
import { useUbicacion } from "../../../hooks/useUbicacion";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/Button";
import Spinner from "../../ui/Spinner";
import PreviewImg from "./PreviewImg";
import { ArrowRight, Camera, ImagePlus, Loader2 } from "lucide-react";
import type { ImagenData, NewUbicacionType } from "../../../types";

type CapturedImgsProps = {
    imgs?: File[];
    position?: NewUbicacionType;
    next: (imgs: ImagenData) => void;
}

export default function CapturedImgs({ imgs, position, next }: CapturedImgsProps) {
    const { videoRef, canvasRef, openCamera, capture } = useCameraCapture();
    const { images, imagenes, addImage, setInitialImages, removeImage } = useCameraImagePreview({max: 3});
    const { getCurrentPosition } = useUbicacion({});

    const [ view, setView ] = useState<"loading" | "camera" | "preview">("loading");
    const [ imgPosition, setImgPosition ] = useState<NewUbicacionType | null>(position ? position : null);

    const { showMessages } = useMessageStore(state => state);
    const navigate = useNavigate();

    useEffect(() => {   
        startCamera();
        
        if (imgs?.length && position) {
            setInitialImages(imgs);
        }
    }, []);

    useEffect(() => {
        if (images.length === 0 && view === "preview") {
            startCamera();
            setImgPosition(null);
        }

        if( images.length === 1 && imgPosition === null ) {
            const getPosition = async () => {
                const pos = await getCurrentPosition();
                setImgPosition(pos);
            };

            getPosition();
        }
    }, [images, view]);

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
        try {
            setView("loading");

            const file = await capture();
            if( !file ) {
                showMessages("error", "No se pudo capturar la imagen");
                return;
            };

            addImage(file);
            setView("preview");
        }
        catch( error ) {
            showMessages("error", "No se pudo agregar la imagen");
        }
    }

    return (
        <>
            { view === "loading" && <Spinner  /> }

            { view === "camera"  &&
                <>
                    <canvas ref={canvasRef} className="h-full" hidden />

                    <video 
                        id="capture-imgs" 
                        ref={videoRef}
                        className="absolute top-0 left-1/2 -translate-x-1/2 h-full object-cover"
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
                <div className="p-5">
                    <div className={`grid gap-3 mb-7 ${images.length === 1 ? "grid-cols-1 place-items-center" : "grid-cols-2"}`}>
                        {images.map(img => (
                            <div
                                key={img.id}
                                className="w-full max-w-[260px]"
                            >
                                <PreviewImg
                                    img={img}
                                    onRemove={removeImage}
                                />
                            </div>
                        ))}
                    </div>
                    
                    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-5 flex gap-2 flex-col w-full md:flex-row md:w-md">
                        { images.length < 3 &&   
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
                            onClick={() => next({ images, imagenes, position: imgPosition! })}
                            disabled={!Boolean(imgPosition)}
                        >
                            { Boolean(imgPosition) ? (
                                <>
                                    Continuar
                                    <ArrowRight className="h-5 w-5"/>
                                </>
                            ) : (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Localizando...
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </> 
    )
}