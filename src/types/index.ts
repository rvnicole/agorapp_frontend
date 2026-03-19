import z from 'zod';
import { 
    AddressResultSchema, 
    DescriptionRespuestaSchema, 
    EstadoStrSchema, 
    googleAuthURL, LoginSchema, 
    MessageSchema, 
    NewUbicacionSchema, 
    PostRespuestaSchema, 
    PostSchema, 
    RegisterSchema, 
    ReportSchema, 
    RespuestaImagenSchema, 
    UserDataSchema 
} from './../schemas/index';

/* ------------------ Errores ------------------ */
export type ApiErrorType = {
    messages: string[];
    code?: string;
}

/* ------------------ Proveedores de Servicio ------------------ */
export type ProviderType = "google" | "microsoft" | "apple";

/* ------------------ User ------------------ */
export type UserData = z.infer<typeof UserDataSchema>;

/* ------------------ Auth ------------------ */
export type LoginType = z.infer<typeof LoginSchema>;
export type RegisterType = z.infer<typeof RegisterSchema>;
export type NewUbicacionType = z.infer<typeof NewUbicacionSchema>;
export type GoogleAuthURL = z.infer<typeof googleAuthURL>;

/* ------------------ Post ------------------ */
export type Post = z.infer<typeof PostSchema>;
export type Report = z.infer<typeof ReportSchema>;
export type AddressResult = z.infer<typeof AddressResultSchema>;

export type NewReport = Omit<Report, "id"|"usuarioId">;

export type EstadoStr = z.infer<typeof EstadoStrSchema>;

export type ImagenPreview = {
    id: string;
    imagen: File;
    url: string;
};

export type ImagenData = {
    images: ImagenPreview[];
    imagenes: File[];
    position: NewUbicacionType;
}

/* ------------------ Messages ------------------ */
export type Message = z.infer<typeof MessageSchema>;

/* ------------------ Permisos del navegador ------------------ */
export type PermissionKey = "camera" | "microphone" | "location";
export type PermissionState = "granted" | "denied" | "prompt" | "unknown";

export type Permissions = {
    camera: PermissionState;
    microphone: PermissionState;
    location: PermissionState;
};

export type CameraError = 
    "PERMISSION_DENIED" | 
    "DEVICE_NOT_FOUND" | 
    "DEVICE_BUSY" | 
    "REQUEST_ABORTED" |
    "UNKNOWN_ERROR";

export type MicrophoneError = CameraError;

export type LocationError = 
    "PERMISSION_DENIED" | 
    "POSITION_UNAVAILABLE" |
    "TIMEOUT" |
    "UNKNOWN_ERROR";

export type PermissionsError = CameraError | MicrophoneError | LocationError;

export type ResultPermission = {
    success: boolean;
    data?: any;
    error?: PermissionsError;
}

/* ------------------ API AgorApp Backend ------------------ */
export type PostRespuesta = z.infer<typeof PostRespuestaSchema>;
export type ImgsRespuesta = z.infer<typeof RespuestaImagenSchema>;
export type DescriptionRespuesta = z.infer<typeof DescriptionRespuestaSchema>;