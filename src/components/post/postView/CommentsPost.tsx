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
}

export default function CommentsPost({ postId, createdAt, usuarioId }: CommentsPostProps) {
    const [comments, setComments] = useState<Comentario []>([]);
    const spinner = useRef<HTMLDivElement>(null);
    const hasFetched = useRef<boolean>(false);

    const { showMessages } = useMessageStore( state => state );

    const { mutate, isPending } = useMutation({
        mutationFn: getComments,
        onSuccess: (data: Comentario[] | undefined ) => {
            if( !data ) return;
            setComments(data);
        },
        onError: (error: ApiErrorType) => {
            error.messages.forEach((error: string) => {
                showMessages("error", error);
            }); 
        }
    });

    useEffect(() => {
        const observador = new IntersectionObserver(arreglo => {
            if( arreglo[0].isIntersecting && !isPending && !hasFetched.current ) {
                hasFetched.current = true; 
                mutate({ id: postId, createdAt });
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
                    postId={postId}
                    createdAt={createdAt}
                    usuarioId={usuarioId}
                    onSuccess={comentario => setComments(c => ([ comentario, ...c ]))}
                />
            </Card>
            
            { !hasFetched.current &&
                <div ref={spinner} className="flex justify-center">
                    <Spinner />
                </div>
            }

            { !comments.length && hasFetched.current &&
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
                        comment={comment}
                    />                                          
                </Card>
            ))}
        </div>        
    )
}