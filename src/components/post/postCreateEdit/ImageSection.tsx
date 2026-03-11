import { useEffect, useState } from "react";
import { useCameraImagePreview } from "../../../hooks/useCameraImagePreview";
import FullScreen from "../../ui/FullScreen";
import CapturedImgs from "../CapturedImgs";
import PreviewImg from "../PreviewImg";
import { Button } from "../../ui/Button";
import { Label } from "../../ui/Label";
import { ImagePlus } from "lucide-react";

type ImageSectionProps = {
    imgs: File[];
    onChange: (imgs: File[]) => void;
}

export default function ImageSection({ imgs, onChange }: ImageSectionProps) {
    const { images, addImage, removeImage } = useCameraImagePreview({max: 3});
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if( imgs ) {
            console.log("PRUEBA ",imgs);
            imgs.forEach(img => addImage(img));
        }
    }, []);
    
    return (
        <div className="space-y-3">
            <Label htmlFor="imgs" className="text-base font-semibold">Fotos*</Label>
            <p className="text-sm text-muted-foreground">Las fotos nos ayudan a entender mejor el problema (3 máximo)</p>
                
            <div className="grid grid-cols-3 gap-3">
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

                { images.map((img, index) => (
                    <div
                        key={`foto-${index}`}
                        className="w-full max-w-[260px]"
                    >
                        <PreviewImg
                            img={img}
                            onRemove={removeImage}
                        />
                    </div>
                ))}

                <FullScreen
                    open={open}
                    onClose={() => setOpen(false)}
                >
                    <CapturedImgs 
                        imgs={imgs}
                        next={(imgs) => {
                            onChange(imgs);
                        }}
                    />
                </FullScreen>
            </div>
        </div>
    )
}