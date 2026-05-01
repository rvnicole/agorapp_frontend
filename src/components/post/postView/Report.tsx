import { useQuery } from "@tanstack/react-query";
import CarruselImgs from "../imagenes/CarruselImgs";
import InformationPost from "./InformationPost";
import UbicacionPost from "./UbicacionPost";
import EstadosPost from "./estados/EstadosPost";
import CommentsPost from "./comments/CommentsPost";
//import CreateEstado from "./estados/CreateEstado";
import { getEstados } from "../../../api/EstadoAPI";
import type { PostRespuesta } from "../../../types";
import { useUserStore } from "../../../store/userStore";
import CommentsPublicPost from "./comments/CommentsPublicPost";

type ReportProps = {
    post: PostRespuesta;
}

export default function Report({ post }: ReportProps) {
    const { user: { alias }} = useUserStore(state => state);

    const { data: estados } = useQuery({
        queryKey: ["get-estado", post.id],
        queryFn: () => getEstados({ id: post.id, createdAt: post.created_at }) 
    });

    return (
        <div className="flex flex-col gap-5 items-center justify-center w-3xl">
            { post.imagenes && <CarruselImgs imgs={post.imagenes} /> }

            <InformationPost post={post} estado={estados && estados[estados?.length - 1]} />

            { post.lat != null && post.lon != null && (
                <UbicacionPost position={{ lat: post.lat, lng: post.lon }}/>
            )}

            {/*<CreateEstado postId={post.id} postCreatedAt={post.created_at} postOwnerId={post.usuario_id} />*/}
            { estados && estados.length > 0  && <EstadosPost estados={estados}/>}

            { alias ? 
                <CommentsPost 
                    postId={post.id} 
                    createdAt={post.created_at} 
                    usuarioId={post.usuario_id}
                    totalComentarios={post.total_comentarios}
                />
                :
                <CommentsPublicPost totalComentarios={post.total_comentarios} />
            }
        </div>
    )
}