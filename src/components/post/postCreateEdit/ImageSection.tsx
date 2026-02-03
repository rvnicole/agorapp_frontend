import { useState, useRef, type ChangeEvent, useEffect } from "react";
import useCameraCapture from "../../../hooks/useCameraCapture";
import useImagenes from "../../../hooks/useImagenes";
import Modal from "../../ui/Modal";
import { Button } from "../../ui/Button";
import { Label } from "../../ui/Label";
import { Camera, ImageIcon, Loader2, X } from "lucide-react";
import { useAppStore } from "../../../store/appStore";

type ImageSectionProps = {
    onChange: (imgs: File[]) => void;
}

export default function ImageSection({ onChange }: ImageSectionProps) {
    const [openModal, setOpenModal] = useState(false); // Abrir o Cerrar Modal
    const inputImgs = useRef<HTMLInputElement>(null);

    const { showMessages } = useAppStore(state => state);

    // Gestionar las imagenes
    const { filesImagenes, imagenes, addImagen, addImagenes, removeImagen } = useImagenes({ max: 3});

    // Gestiona la camara
    const { isOpen, videoRef, canvasRef, openCamera, capture, closeCamera } = useCameraCapture();

    useEffect(() => {
        onChange(filesImagenes);
    }, [filesImagenes, onChange]);

    useEffect(() => {
        if( !openModal ) return;

        const startCamera = async () => {
            const res = await openCamera();
    
            if (!res.success && res.error ) {
                setOpenModal(false);
                showMessages("error", res.error);
            }
        };
    
        startCamera();
    }, [openModal]);

    // Tomar foto desde la camara
    const handleCaptureImg = async () => {
        const file = await capture();
        if( !file ) {
            console.log("No se pudo capturar la imagen")
            return;
        };

        addImagen( file );
        setOpenModal( false );
    }

    // Agregar imagenes
    const handleAddImgs = (e: ChangeEvent<HTMLInputElement>) => {
        const inputFiles = e.target.files;
        if( !inputFiles ) return;

        const files = Object.values(inputFiles);
        addImagenes( files );

        e.target.value = "";
    }
    
    return (
        <div className="space-y-3">
            <Label htmlFor="imgs" className="text-base font-semibold">Fotos*</Label>
            <p className="text-sm text-muted-foreground">Agrega fotos para ayudarnos a entender mejor el problema (3 máximo)</p>
                
            <div className="grid grid-cols-3 gap-3">
                { imagenes.length < 3 && (
                    <>
                        <Button
                            type="button"
                            variant="outline"
                            size="default"
                            className="aspect-square h-auto flex flex-col items-center justify-center gap-2"
                            onClick={() => setOpenModal(true)}
                        >                            
                            <Camera className="h-6 w-6" />
                            <span className="text-sm font-semibold">Cámara</span>
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            size="default"
                            className="aspect-square h-auto flex flex-col items-center justify-center gap-2"
                            onClick={() => inputImgs.current && inputImgs.current.click() }
                        >
                            <ImageIcon className="h-6 w-6" />
                            <span className="text-sm font-semibold">Galería</span>
                        </Button>
                    </>
                )}

                { imagenes.map((i, index) => (
                    <div
                        key={`${i.imagen.name}-${i.imagen.lastModified}`}
                        className="relative aspect-square"
                    >
                        <img
                            src={i.url} 
                            alt={`Foto ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                        />

                        <Button
                            aria-label="Eliminar imagen"
                            type="button"
                            variant="destructive"
                            size="icon"
                            data-img={`${i.imagen.name}-${i.imagen.lastModified}`}
                            className="absolute -top-2 -right-2 flex justify-center items-center h-6 w-6 rounded-full"
                            onClick={() => removeImagen(`${i.imagen.name}-${i.imagen.lastModified}`)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>  
                ))}

                <Modal 
                    open={openModal} 
                    onClose={() => {
                        closeCamera();
                        setOpenModal(false);                            
                    }}
                >
                    <div className="relative p-2">
                        <video 
                            id="capture-imgs" 
                            ref={videoRef} 
                            className={`rounded-xl ${isOpen ? "block" : "hidden"}`}
                            autoPlay 
                        />

                        <canvas ref={canvasRef} hidden />

                        <Button
                            type="button"
                            variant="default"
                            size="default"
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center h-12 w-12 rounded-full"
                            onClick={handleCaptureImg}
                            hidden={!isOpen} 
                        >
                            <Camera className="h-6 w-6"/>
                        </Button>

                        { !isOpen && 
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Accediendo a la cámara...
                            </div>
                        }
                    </div> 
                </Modal>
            </div>
                
            <input 
                id="imgs" 
                type="file"
                ref={inputImgs}
                accept="image/png, image/jpeg"
                onChange={handleAddImgs}
                multiple 
                hidden
            />
        </div>
    )
}