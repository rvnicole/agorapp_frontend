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

export default function EstadoPost({ estados }: EstadoPostProps) {
    if( !estados || !estados.length ) return null;

    return (
        <Card className="border p-5 w-full relative">
            <div className="absolute top-6 bottom-5 left-[33px] w-0.5 bg-muted" />
            
            { estados.map( data => {
                const { estadoId, estado, descripcion, createdAt, updatedAt, editado, alias: { alias } } = data;
    
                const fecha = editado ? updatedAt : createdAt;
                const estadoDetail = estadosDetails[estado];

                return (
                    <div
                        key={estadoId}
                        className="w-full flex items-start gap-3"
                    >                   
                        <div className={`z-10 flex items-center justify-center h-7 w-7 shrink-0 rounded-full ${estadoDetail.color}`}>
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
                )
            })}
        </Card>
    )
}