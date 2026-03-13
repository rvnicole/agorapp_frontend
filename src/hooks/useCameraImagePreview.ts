import { useEffect, useMemo, useRef, useState } from "react";
import type { ImagenPreview } from "../types";

type UseCameraImagePreviewProps = {
    max: number;
};

export function useCameraImagePreview({ max }: UseCameraImagePreviewProps) {
    const [images, setImages] = useState<ImagenPreview[]>([]);
    const imagesRef = useRef<ImagenPreview []>([]); 

    // Actualizar el Ref con el State actual
    useEffect(() => {
        imagesRef.current = images;
    }, [images]);


    // Se limpia la memoria al desmontar el componente
    useEffect(() => {
        return () => {
            imagesRef.current.forEach(img =>  URL.revokeObjectURL(img.url));
        };
    }, []);

    // Agregar Imagen
    const addImage = (img: File) => {
        setImages(prev => {
            if (prev.length >= max) return prev;

            const preview: ImagenPreview = {
                id: `${img.name}-${img.lastModified}`,
                imagen: img,
                url: URL.createObjectURL(img)
            };

            return [...prev, preview];
        });
    };

    // Elimina una imagen
    const removeImage = (id: string) => {
        setImages(prev => {
            const img = prev.find(i => i.id === id);
            
            // Libera memoria inmediatamente
            if (img) URL.revokeObjectURL(img.url);

            return prev.filter(i => i.id !== id);
        });
    };

    // Imagenes iniciales
    const setInitialImages = (imgs: File[]) => {
        imagesRef.current.forEach(img => URL.revokeObjectURL(img.url));
        
        const previews = imgs.slice(0, max).map(img => ({
            id: `${img.name}-${img.lastModified}`,
            imagen: img,
            url: URL.createObjectURL(img),
        }));
    
        setImages(previews);
    };

    //Imagenes para enviar al backend
    const imagenes = useMemo(() => images.map(i => i.imagen), [images]);

    return {
        images,
        imagenes,
        addImage,
        removeImage,
        setInitialImages
    };
}