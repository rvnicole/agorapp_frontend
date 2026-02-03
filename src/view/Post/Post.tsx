import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom"
import { getPost } from "../../api/PostAPI";
import { useAppStore } from "../../store/appStore";
import Spinner from "../../components/ui/Spinner";
import UbicacionPost from "../../components/post/postView/UbicacionPost";
import InformationPost from "../../components/post/postView/InformationPost";
import CarruselImgs from "../../components/post/CarruselImgs";

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
        <div className="flex items-center justify-center">
            <div className="flex flex-col gap-5 items-center justify-center w-3xl">
                {data[0].imagenes && <CarruselImgs imgs={data[0].imagenes} />}

                <InformationPost post={data[0]} />

                { data[0].lat != null && data[0].lon != null && (
                    <UbicacionPost position={{ lat: data[0].lat, lng: data[0].lon }}/>
                )}
            </div>
        </div>
    )
}