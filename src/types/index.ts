import z from 'zod';
import { AddressResultSchema, LoginSchema, NewReportSchema, NewUbicacionSchema, PostSchema, RegisterSchema, ReportSchema } from './../schemas/index';

export type ProviderType = "google" | "microsoft" | "apple";

//Auth
export type LoginType = z.infer<typeof LoginSchema>;
export type RegisterType = z.infer<typeof RegisterSchema>;
export type NewUbicacionType = z.infer<typeof NewUbicacionSchema>;

//Post
export type Post = z.infer<typeof PostSchema>;
export type NewReport = z.infer<typeof NewReportSchema>;
export type Report = z.infer<typeof ReportSchema>;
export type AddressResult = z.infer<typeof AddressResultSchema>;