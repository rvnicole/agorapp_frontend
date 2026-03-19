import type { EstadoStr } from "../types"

type estadosDetailsType = Record<EstadoStr,{
    color: string,
    titulo: string
}>

export const estadosDetails: estadosDetailsType = {
    "asignado": {
        color: "bg-indigo-400",
        titulo: "Asignado"
    },
    "pendiente": {
        color: "bg-yellow-400",
        titulo: "Pendiente"
    },
    "en progreso": {
        color: "bg-sky-400",
        titulo: "En Progreso"
    },
    "resuelto": {
        color: "bg-green-500",
        titulo: "Resuelto"
    }
}
