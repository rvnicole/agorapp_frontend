import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom"
import { useMessageStore } from "../../store/messageStore";
import { getPost } from "../../api/PostAPI";
import Spinner from "../../components/ui/Spinner";
import Report from "../../components/post/postView/Report";
import type { Post } from "../../types";

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
            <Report post={data[0]}/>
        </div>
    )
    return null;
}