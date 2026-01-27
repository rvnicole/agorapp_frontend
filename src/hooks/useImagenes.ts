import { useEffect, useMemo, useState } from "react";

type ImagePreview = {
    imagen: File;
    url: string;
};

type UseImagenesProps = {
    max: number;
}

export default function useImagenes({ max }: UseImagenesProps) {
    const [imagenes, setImagenes] = useState<ImagePreview[]>([]);
    const filesImagenes = useMemo(() => imagenes.map(i => i.imagen), [imagenes]);
    
    useEffect(() => {
        return () => {
            imagenes.forEach(i => URL.revokeObjectURL(i.url));
        };
    }, [imagenes]);      

    const addImagenes = (files: File[]) => {
        setImagenes(i => {
            const totalActual = max - i.length;
            if (!totalActual) return i;
          
            const permitidas = files.slice(0, totalActual);

            const nuevas = permitidas.filter(file => 
                !i.find(f => file.name === f.imagen.name && file.lastModified === f.imagen.lastModified )
            );

            const newImagenes = nuevas.map(file => ({
                imagen: file,
                url: URL.createObjectURL(file),
            }));
          
            return [...i, ...newImagenes];
        });          
    };

    const addImagen = (file: File) => {
        addImagenes([file]);
    };

    const removeImagen = (id: string) => {
        setImagenes(prev => {
            const img = prev.find(i => `${i.imagen.name}-${i.imagen.lastModified}` === id);

            if( img ) {
                URL.revokeObjectURL(img.url);
            }
          
            return prev.filter(i => `${i.imagen.name}-${i.imagen.lastModified}` !== id);
        });          
    };

    return {
        filesImagenes,
        imagenes,
        addImagen,
        addImagenes,
        removeImagen
    }
}