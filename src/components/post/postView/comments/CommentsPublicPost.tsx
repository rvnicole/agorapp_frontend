import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthModalStore } from "../../../../store/authModalStore";
import TitleSection from "../../../ui/TitleSection";
import { Button } from "../../../ui/Button";
import { MessageCircle } from "lucide-react";
import type { Post } from "../../../../types";

type CommentsPublicPostProps = {
    totalComentarios: Post["totalComentarios"];
}

export default function CommentsPublicPost({ totalComentarios }: CommentsPublicPostProps) {
    const { setOpenModal, setAction } = useAuthModalStore( state => state );
    const element = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const observador = new IntersectionObserver(arreglo => {
            if( arreglo[0].isIntersecting ) {
                setOpenModal(true);
                setAction("comments");
            }
        });

        if(element.current) observador.observe( element.current );

        return () => observador.disconnect();
    }, [element]);
    
    return (
        <div id="comentarios-public-post" className="w-full space-y-3">
            <TitleSection
                icon={<MessageCircle className="h-5 w-5" />}
                title={`Comentarios (${totalComentarios})`}
            />

            <div ref={element} className="flex flex-col justify-center items-center text-center gap-2 px-5 my-10">
                <p className="text-primary font-semibold">Únete para comentar y ver los comentarios de este reporte</p>
                <Button 
                    className="flex items-center justify-center w-fit"
                    onClick={() => navigate("/auth/login")}
                >
                    Unirme
                </Button>
            </div>
        </div>
    )
}