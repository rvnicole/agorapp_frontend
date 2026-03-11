import { useEffect, useMemo, useRef, useState } from "react";
import type { ImagenPreview } from "../types";

type UseCameraImagePreviewProps = {
    max: number;
};

export function useCameraImagePreview({ max }: UseCameraImagePreviewProps) {
    // Imagenes capturadas
    const [images, setImages] = useState<ImagenPreview[]>([]);

    // Para limpiar la memoria cuando se desmonte el componente
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
                imagen: img,
                url: URL.createObjectURL(img), // Crea una URL temporal que apunta a la imagen(blob) en memoria
            };

            return [...prev, preview];
        });
    };

    // Elimina una imagen
    const removeImage = (id: string) => {
        setImages(prev => {
            const img = prev.find(i => `${i.imagen.name}-${i.imagen.lastModified}` === id);
            
            // Libera memoria inmediatamente
            if (img) URL.revokeObjectURL(img.url);

            return prev.filter(i => `${i.imagen.name}-${i.imagen.lastModified}` !== id);
        });
    };

    // Imagenes iniciales
    const setInitialImages = (files: File[]) => {
        const previews = files.slice(0, max).map(file => ({
            imagen: file,
            url: URL.createObjectURL(file)
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