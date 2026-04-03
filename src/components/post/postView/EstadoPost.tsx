import { Card } from "../../ui/Card";
import { formatDate } from "../../../utils/date";
import { estadosDetails } from "../../../data/estados";
import { GitCommitVertical } from "lucide-react";
import TitleSection from "../../ui/TitleSection";
import type { Post } from "../../../types";

type EstadoPostProps = {
    estados: Post['estados'];
}

export default function EstadoPost({ estados }: EstadoPostProps) {
    if( !estados || !estados.length ) return null;

    return (
        <div id="estados-post" className="w-full space-y-3">
            <TitleSection
                icon={<GitCommitVertical className="h-5 w-5" />}
                title="Historial de Estados"
            />

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
        </div>
    )
}