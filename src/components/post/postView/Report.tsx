import CarruselImgs from "../imagenes/CarruselImgs";
import InformationPost from "./InformationPost";
import UbicacionPost from "./UbicacionPost";
import EstadoPost from "./EstadoPost";
import CommentsPost from "./comments/CommentsPost";
import type { PostRespuesta } from "../../../types";
import CreateEstado from "./CreateEstado";

type ReportProps = {
    post: PostRespuesta;
}

export default function Report({ post }: ReportProps) {
    return (
        <div className="flex flex-col gap-5 items-center justify-center w-3xl">
            { post.imagenes && <CarruselImgs imgs={post.imagenes} /> }

            <InformationPost post={post} />

            { post.lat != null && post.lon != null && (
                <UbicacionPost position={{ lat: post.lat, lng: post.lon }}/>
            )}

            <CreateEstado postId={post.id} postCreatedAt={post.created_at}/>
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