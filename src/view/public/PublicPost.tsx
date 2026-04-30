import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMessageStore } from "../../store/messageStore";
import { useUserStore } from "../../store/userStore";
import { useQuery } from "@tanstack/react-query";
import { getPublicPost } from "../../api/PublicAPI";
import Spinner from "../../components/ui/Spinner";
import Report from "../../components/post/postView/Report";

export default function PublicPost() {
    const { showMessages } = useMessageStore(state => state);
    const { user: { alias} } = useUserStore(state => state);
    const navigate = useNavigate();

    const params = useParams();
    const id = Number( params.id );

    const search = (location.search).replace("+", "%2B");
    const searchParams = new URLSearchParams( search );
    const createdAt = String( searchParams.get("createdAt") );

    const { data, isLoading, isError } = useQuery({
        queryKey: ["get-post", id, createdAt],
        queryFn: async () => getPublicPost({ id, createdAt }),
        retry: 2
    });

    useEffect(() => {
        if (isError) {
            showMessages("error", "No se encontro la publicación");
            navigate("/");
        };
        window.scrollTo(0,0);
    }, [isError]);

    useEffect(() => {
        if( alias ) {
            navigate(`/post/reporte/${id}?createdAt=${createdAt}`);
        }
    }, [alias]);

    if( isLoading ) return (
        <div className="flex justify-center">
            <Spinner />
        </div>
    )
    else if( data ) return (
        <div className="flex items-center justify-center">
            <Report post={data[0]}/>
        </div>
    )
    return null;
}