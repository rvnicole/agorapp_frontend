import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom"
import { getPost } from "../../api/PostAPI";
import { useAppStore } from "../../store/appStore";
import Spinner from "../../components/ui/Spinner";
import UbicacionPost from "../../components/post/postView/UbicacionPost";

export default function Post() {
    const { showMessages } = useAppStore(state => state);
    const navigate = useNavigate();

    const params = useParams();
    const id = Number( params.id );
    const tipo = params.tipo; // Reporte, Aviso o Publicidad 

    const search = (location.search).replace("+", "%2B");
    const searchParams = new URLSearchParams( search );
    const createdAt = String( searchParams.get("createdAt") );

    const { data, isLoading, isError } = useQuery({
        queryKey: ["get-post", id, createdAt],
        queryFn: async () => getPost({ id, createdAt })
    });

    console.log(data);

    if( isError ) {
        navigate("/");
        showMessages("error", "No se encontro la publicación");
    }
    else if( isLoading ) return (
        <div className="flex justify-center">
            <Spinner />
        </div>
    )
    else if( data ) return (
        <div className="flex items-center justify-center w-full">
            <UbicacionPost post={data[0]}/>
        </div>
    )
}