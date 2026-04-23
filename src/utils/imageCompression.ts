import imageCompresssion from "browser-image-compression";

export const comprimirImagen = async (file: File) => {
    const opciones = {
        maxSizeMB: 0.7,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        quality: 0.77
    };

    try {
        const comprimida = await imageCompresssion(file, opciones);
        console.log(`Original: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Comprimida: ${(comprimida.size / 1024 / 1024).toFixed(2)} MB`);
        return comprimida;
    } catch (error) {
        console.error('Error al comprimir:', error);
        return file;
    };
};