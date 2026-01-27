import z from "zod";

/* ------------------ Auth ------------------ */
export const LoginSchema = z.object({
    email: z.string(),
    token: z.string()
});

export const RegisterSchema = z.object({
    nombre: z.string(),
    apellido: z.string(),
    email: z.string(),
    curp: z.string().optional(),
    alias: z.string(),
    telefono: z.string().optional(),
    fecha_nacimiento: z.date(),
    url_img: z.string().optional(),
    proveedor_esp_id: z.string().optional(),
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-180).max(180),
});


/* ------------------ Post ------------------ */
export const NewUbicacionSchema = z.object({
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-180).max(180),
});

const ImagenSchema = z.instanceof(File);

export const PostSchema = z.object({
    id: z.number(),
    titulo: z.string(),
    descripcion: z.string(),
    usuarioId: z.number(),
    tipo: z.literal(["reporte", "aviso", "publicidad"]),
    categoriaId: z.number(),
    lat: z.coerce.number().min(-90).max(90).optional(),
    lng: z.coerce.number().min(-180).max(180).optional(),
    organizacionId: z.number(),
    link: z.string().optional(),
    ubicacionId: z.number(),
    totalComentarios: z.number(),
    totalLikes: z.number(),
    totalCompartidos: z.number(),
    activo: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    imgs: z.array( ImagenSchema ).max(3, "Máximo 3 imágenes")
});

export const NewReportSchema = PostSchema.pick({
    tipo: true,
    titulo: true,
    categoriaId: true,
    descripcion: true,
    lat: true,
    lng: true,
    usuarioId: true,
    imgs: true
});

export const ReportSchema = PostSchema.pick({
    id: true,
    tipo: true,
    titulo: true,
    categoriaId: true,
    descripcion: true,
    lat: true,
    lng: true,
    usuarioId: true,    
    imgs: true
});


/* ------------------ nominatim ------------------ */
export const AddressSchema = z.object({
    address: z.object({
        road: z.string().optional(), 
        city: z.string().optional(),  
        county: z.string().optional(),
        state: z.string(),
        country: z.string()
    })
});

export const AddressResultSchema = z.object({
    place_id: z.number(),
    lat: z.string(),
    lon: z.string(),
    display_name: z.string()
});

/* ------------------ Messages ------------------ */
export const MessageSchema = z.object({
    id: z.string(),
    type: z.literal(["success", "error", "info", "warning"]),
    text: z.string()
});