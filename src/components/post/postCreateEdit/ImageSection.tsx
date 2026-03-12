import { useEffect, useState } from "react";
import { useCameraImagePreview } from "../../../hooks/useCameraImagePreview";
import FullScreen from "../../ui/FullScreen";
import CapturedImgs from "../CapturedImgs";
import PreviewImg from "../PreviewImg";
import { Button } from "../../ui/Button";
import { Label } from "../../ui/Label";
import { ImagePlus } from "lucide-react";
import type { ImagenData, NewUbicacionType } from "../../../types";

type ImageSectionProps = {
    imgs: File[];
    position: NewUbicacionType;
    onChange: (imgs: ImagenData) => void;
}

export default function ImageSection({ imgs, position, onChange }: ImageSectionProps) {
    const { images, imagenes, positions, removeImage, setInitialImages } = useCameraImagePreview({max: 3});
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setInitialImages(imgs, position);
    }, [imgs, position]);

    const handleRemoveImage = (id: string) => {
        removeImage(id);
                                
        const newImages = images.filter(img => img.id !== id);
        const newImagenes = newImages.map(img => img.imagen);
        const newPosition = newImages.map(img => img.position);
        
        onChange({ 
            images: newImages, 
            imagenes: newImagenes, 
            positions: newPosition
        });
    }
    
    return (
        <div className="space-y-3">
            <Label htmlFor="imgs" className="text-base font-semibold">Fotos*</Label>
            <p className="text-sm text-muted-foreground">Las fotos nos ayudan a entender mejor el problema (3 máximo)</p>
                
            <div className="grid grid-cols-3 gap-3 place-items-center">
                { images.map(img => (
                    <div
                        key={img.id}
                        className="w-full max-w-[260px]"
                    >
                        <PreviewImg
                            img={img}
                            onRemove={handleRemoveImage}
                        />
                    </div>
                ))}

                { images.length < 3 && (
                    <Button
                        type="button"
                        variant="secondary"
                        className="flex items-center justify-center gap-1 w-16 h-16 rounded-full"
                        onClick={() => setOpen(true)}
                    >
                        <ImagePlus className="h-6 w-6" />
                    </Button>
                )}
            </div>

            { open && (
                    <FullScreen
                        open={open}
                        onClose={() => setOpen(false)}
                    >
                        <CapturedImgs 
                            imgs={imagenes}
                            position={{
                                lat: positions[0].lat,
                                lng: positions[0].lng
                            }}
                            next={data => {
                                onChange(data);
                                setOpen(false);
                            }}
                        />
                    </FullScreen>
                )}
        </div>
    )
}