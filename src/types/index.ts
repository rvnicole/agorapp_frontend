import z from 'zod';
import { AddressResultSchema, LoginSchema, MessageSchema, NewUbicacionSchema, PostRespuestaSchema, PostSchema, RegisterSchema, ReportSchema, RespuestaImagenSchema } from './../schemas/index';

/* ------------------ Proveedores de Servicio ------------------ */
export type ProviderType = "google" | "microsoft" | "apple";

/* ------------------ Auth ------------------ */
export type LoginType = z.infer<typeof LoginSchema>;
export type RegisterType = z.infer<typeof RegisterSchema>;
export type NewUbicacionType = z.infer<typeof NewUbicacionSchema>;

/* ------------------ Post ------------------ */
export type Post = z.infer<typeof PostSchema>;
export type Report = z.infer<typeof ReportSchema>;
export type AddressResult = z.infer<typeof AddressResultSchema>;

/* ------------------ Messages ------------------ */
export type Message = z.infer<typeof MessageSchema>;

/* ------------------ Permisos del navegador ------------------ */
export type PermissionState = "granted" | "denied" | "prompt" | "unknown";

export type Permissions = {
    camera: PermissionState;
    microphone: PermissionState;
    location: PermissionState;
};

/* ------------------ API AgorApp Backend ------------------ */
export type PostRespuesta = z.infer<typeof PostRespuestaSchema>;
export type ImgsRespuesta = z.infer<typeof RespuestaImagenSchema>;