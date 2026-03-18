import { Card } from "../../ui/Card";
import { formatDate } from "../../../utils/date";
import type { Post } from "../../../types";

type EstadoPostProps = {
    estados: Post['estados'];
}

const estadosDetails = {
    "asignado": {
        color: "bg-indigo-400",
        titulo: "Asignado"
    },
    "pendiente": {
        color: "bg-amber-400",
        titulo: "Pendiente"
    },
    "en progreso": {
        color: "bg-sky-400",
        titulo: "En Progreso"
    },
    "resuelto": {
        color: "bg-lime-400",
        titulo: "Resuelto"
    }
}

export default function EstadoPost({ estados }: EstadoPostProps) {
    if( !estados ) return null;

    const { estado, descripcion, createdAt, updatedAt, editado, alias: { alias } } = estados[ estados.length - 1];
    
    const fecha = editado ? updatedAt : createdAt;
    const estadoDetail = estadosDetails[estado];

    return (
        <Card className="border p-5 w-full">
            <div className="flex items-start gap-3">
                <div className={`flex items-center justify-center h-7 w-7 rounded-full ${estadoDetail.color}`}>
                    <div className="h-3 w-3 bg-card rounded-full"/>
                </div>

                <div className="w-full">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold">{estadoDetail.titulo}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(fecha)}</p> 
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{descripcion}</p>
                    <p className="text-xs text-muted-foreground">Por: {alias}</p>
                </div>
            </div>
        </Card>
    )
}