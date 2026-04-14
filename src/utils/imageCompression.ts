import imageCompresssion from "browser-image-compression";

export const comprimirImagen = async (file: File) => {
    const opciones = {
        maxSizeMB: 1,          // máximo 1MB por imagen
        maxWidthOrHeight: 1920, // resolución máxima
        useWebWorker: true,     // no bloquea el hilo principal
        quality: 0.8            // 80% de calidad — buen balance
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