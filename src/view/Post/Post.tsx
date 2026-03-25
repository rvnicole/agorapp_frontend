import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom"
import { getPost } from "../../api/PostAPI";
import { useMessageStore } from "../../store/messageStore";
import Spinner from "../../components/ui/Spinner";
import UbicacionPost from "../../components/post/postView/UbicacionPost";
import InformationPost from "../../components/post/postView/InformationPost";
import CarruselImgs from "../../components/post/CarruselImgs";
import type { Post } from "../../types";
import { useEffect } from "react";
import EstadoPost from "../../components/post/postView/EstadoPost";
import CommentsPost from "../../components/post/postView/CommentsPost";

export default function Post() {
    const { showMessages } = useMessageStore(state => state);
    const navigate = useNavigate();

    const params = useParams();
    const id = Number( params.id );

    const search = (location.search).replace("+", "%2B");
    const searchParams = new URLSearchParams( search );
    const createdAt = String( searchParams.get("createdAt") );

    const { data, isLoading, isError } = useQuery({
        queryKey: ["get-post", id, createdAt],
        queryFn: async () => getPost({ id, createdAt }),
        retry: 2
    });

    useEffect(() => {
        if (isError) {
            showMessages("error", "No se encontro la publicación");
            navigate("/");
        }
    }, [isError]);

    if( isLoading ) return (
        <div className="flex justify-center">
            <Spinner />
        </div>
    )
    else if( data ) return (
        <div className="flex items-center justify-center">
            <div className="flex flex-col gap-5 items-center justify-center w-3xl">
                { data[0].imagenes && <CarruselImgs imgs={data[0].imagenes} /> }

                <InformationPost post={data[0]} />

                { data[0].lat != null && data[0].lon != null && (
                    <UbicacionPost position={{ lat: data[0].lat, lng: data[0].lon }}/>
                )}

                <EstadoPost estados={data[0].estados}/>

                <CommentsPost 
                    postId={data[0].id} 
                    createdAt={data[0].created_at} 
                    usuarioId={data[0].usuario_id}
                />
            </div>
        </div>
    )
    return null;
}