import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useMessageStore } from "../../../store/messageStore";
import { Card } from "../../ui/Card";
import CreateComment from "../CreateComment";
import Comment from "../Comment";
import Spinner from "../../ui/Spinner";
import { getComments } from "../../../api/CommentAPI";
import { MessageCircle } from "lucide-react";
import type { ApiErrorType, Comentario, Post } from "../../../types";

type CommentsPostProps = {
    postId: Post["id"],
    createdAt: Post["createdAt"]
    usuarioId: Post["usuarioId"],
    totalComentarios: Post["totalComentarios"]
}

export default function CommentsPost({ postId, createdAt, usuarioId, totalComentarios }: CommentsPostProps) {
    const [comments, setComments] = useState<Comentario []>([]);
    const [lastId, setLastId] = useState(0);
    const [lastResult, setLastResult] = useState(false);
    const spinner = useRef<HTMLDivElement>(null);
    console.log({totalComentarios, comments: comments.length});

    const { showMessages } = useMessageStore( state => state );

    const { mutate, isPending } = useMutation({
        mutationFn: getComments,
        onSuccess: (data: Comentario[] | undefined ) => {
            if( !data ) return;

            const newComments = data.filter(comment => !comments.find(c => c.id === comment.id));
            
            if( newComments.length > 0 ) {
                setComments(c => ([...c, ...newComments]));

                const newLastId = newComments[newComments.length - 1].id;
                setLastId(newLastId);
            }

            if( data.length === 0 ){
                setLastResult(true);
            };
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
                mutate({ id: postId, createdAt, lastId });
            }
        });

        if(spinner.current) {
            observador.observe( spinner.current );
        }
        
        if( lastResult ) {
            observador.disconnect();
        }

        return () => {
                observador.disconnect();
        };
    }, [spinner, isPending]);

    return (
        <div className="w-full space-y-3">
            <div className="flex items-center gap-2 ml-4 md:ml-0">
                <MessageCircle className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Comentarios ({comments.length})</h3>
            </div>

            <Card className="border p-5 w-full">
                <CreateComment 
                    postId={postId}
                    createdAt={createdAt}
                    usuarioId={usuarioId}
                    onSuccess={comentario => setComments(c => ([ comentario, ...c ]))}
                />
            </Card>

            { !comments.length &&
                <div className="flex justify-center py-5">
                    <p className="text-sm text-muted-foreground">Sé el primero en comentar</p>
                </div> 
            }
                       
            { comments.map(comment => (
                <Card
                    key={comment.id}
                    className="border p-5 w-full"
                >
                    <Comment 
                        postId={postId}
                        createdAt={createdAt}
                        usuarioId={usuarioId}
                        comentario={comment}
                    />                                          
                </Card>
            ))}
            {
                !lastResult &&
                <div ref={spinner} className="flex justify-center">
                    <Spinner />
                </div>
            }
        </div>        
    )
}