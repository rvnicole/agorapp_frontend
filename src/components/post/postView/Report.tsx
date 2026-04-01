import CarruselImgs from "../imagenes/CarruselImgs";
import InformationPost from "./InformationPost";
import UbicacionPost from "./UbicacionPost";
import EstadoPost from "./EstadoPost";
import CommentsPost from "./comments/CommentsPost";
import { Button } from "../../ui/Button";
import { Images } from "lucide-react";
import type { PostRespuesta } from "../../../types";

type ReportProps = {
    post: PostRespuesta;
}

export default function Report({ post }: ReportProps) {
    return (
        <div className="flex flex-col gap-5 items-center justify-center w-3xl">
            { post.imagenes && 
                <div className="relative">
                    <Button variant="secondary" className="absolute top-2 right-2 z-10 flex items-center gap-1"> 
                        <Images className="h-5 w-5"/>
                        Editar
                    </Button>

                    <CarruselImgs imgs={post.imagenes} /> 
                </div>
            }

            <InformationPost post={post} />

            { post.lat != null && post.lon != null && (
                <UbicacionPost position={{ lat: post.lat, lng: post.lon }}/>
            )}

            <EstadoPost estados={post.estados}/>

            <CommentsPost 
                postId={post.id} 
                createdAt={post.created_at} 
                usuarioId={post.usuario_id}
                totalComentarios={post.total_comentarios}
            />
        </div>
    )
}