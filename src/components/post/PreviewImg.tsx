import { Button } from "../ui/Button";
import { X } from "lucide-react";
import type { ImagenPreview } from "../../types";

type PreviewImgProps = {
    img: ImagenPreview;
    onRemove: (id: string) => void;
}

export default function PreviewImg({ img, onRemove }: PreviewImgProps ) {
    const imgName = `${img.imagen.name}-${img.imagen.lastModified}`;

    return (
        <div
            key={imgName}
            className="relative"
        >
            <img
                src={img.url} 
                alt={`Foto ${imgName}`}
                className="w-full h-auto object-contain rounded-lg"
            />
            
            <Button
                aria-label="Eliminar imagen"
                type="button"
                variant="destructive"
                size="icon"
                data-img={imgName}
                className="absolute -top-2 -right-2 flex justify-center items-center h-6 w-6 rounded-full"
                onClick={() => onRemove(imgName)}
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    )
}