import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "../../ui/Card";
import CreateComment from "../CreateComment";
import Spinner from "../../ui/Spinner";
import { formatDate } from "../../../utils/date";
import { MessageCircle } from "lucide-react";
import type { ApiErrorType, Post } from "../../../types";
import { getComments } from "../../../api/PostAPI";
import { useMessageStore } from "../../../store/messageStore";

type CommentsPostProps = {
    id: Post["id"],
    createdAt: Post["createdAt"]
    usuarioId: Post["usuarioId"],
}

export default function CommentsPost({ id, createdAt, usuarioId }: CommentsPostProps) {
    const [comments, setComments] = useState([]);
    const spinner = useRef<HTMLDivElement>(null);

    const { showMessages } = useMessageStore( state => state );

    const { mutate, isPending } = useMutation({
        mutationFn: getComments,
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (error: ApiErrorType) => {
            error.messages.forEach((error: string) => {
                showMessages("error", error);
            }); 
        }
    });

    useEffect(() => {
        const observador = new IntersectionObserver(arreglo => {
            if( arreglo[0].isIntersecting && !isPending ) {
                console.log("Cargar...");
                mutate({ id, createdAt });
            }
        });

        if(spinner.current) {
            observador.observe( spinner.current );
        }

        return () => {
            if (spinner.current) {
                observador.unobserve(spinner.current);
            }
        };
    }, [spinner]);

    return (
        <div className="w-full space-y-3">
            <div className="flex items-center gap-2 ml-4 md:ml-0">
                <MessageCircle className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Comentarios ({comments.length})</h3>
            </div>

            <Card className="border p-5 w-full">
                <CreateComment 
                    id={id}
                    createdAt={createdAt}
                    usuarioId={usuarioId}
                    onSuccess={(comentario) => {}}
                />
            </Card>
            
            <div ref={spinner} className="flex justify-center">
                <Spinner />
            </div> 

            { comments.map(comment => {
                const { comentId, usuario, comentario, fecha, replyCommentId } = comment;

                return (
                    <Card
                        key={comentId}
                        className="border p-5 w-full"
                    >
                        <div>
                            <div className="flex items-center justify-between">
                                <p className="font-semibold">{usuario}</p>
                                <p className="text-xs text-muted-foreground">{formatDate(fecha)}</p> 
                            </div>

                            <p className="text-sm text-muted-foreground">{comentario}</p>

                            <CreateComment 
                                id={id}
                                createdAt={createdAt}
                                usuarioId={usuarioId}
                                replyCommentId={replyCommentId}
                                reply={true}
                                onSuccess={(comentario) => {}}
                            />
                        </div>                        
                    </Card>
                )
            })}
        </div>        
    )
}