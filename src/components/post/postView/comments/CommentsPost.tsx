import { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMessageStore } from "../../../../store/messageStore";
import { Card } from "../../../ui/Card";
import CreateComment from "./CreateComment";
import ReplyComment from "./ReplyComment";
import Comment from "./Comment";
import Spinner from "../../../ui/Spinner";
import { APIAgorAppError } from "../../../../errors/ApiError";
import { getComments } from "../../../../api/CommentAPI";
import { MessageCircle } from "lucide-react";
import type { Comentario, Post } from "../../../../types";

type CommentsPostProps = {
    postId: Post["id"],
    createdAt: Post["createdAt"]
    usuarioId: Post["usuarioId"],
    totalComentarios: Post["totalComentarios"]
}

export default function CommentsPost({ postId, createdAt, usuarioId, totalComentarios }: CommentsPostProps) {
    const [commentToReply, setCommentToReply] = useState<Comentario | null>(null);
    const spinner = useRef<HTMLDivElement>(null);

    const { showMessages } = useMessageStore( state => state );

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error, isError } = useInfiniteQuery({
        queryKey: ["comments", postId],
        queryFn: ({ pageParam = 0 }) => getComments({
            id: postId,
            createdAt,
            lastId: pageParam
        }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            if( !lastPage?.length ) return undefined;
            
            const lastComment = lastPage[lastPage.length - 1];
            return lastComment.id;
        }
    });

    const comments = useMemo(() => {
        const flat = data?.pages.flat() || [];
        return flat.filter((comment, index, data) => index === data.findIndex(c => c.id === comment.id));
    }, [data]);

    useEffect(() => {
        if ( isError && error instanceof APIAgorAppError) {
            error.messages.forEach((error: string) => showMessages("error", error));
        }
    }, [isError, error]);

    useEffect(() => {
        const observador = new IntersectionObserver(arreglo => {
            if( arreglo[0].isIntersecting && hasNextPage && !isFetchingNextPage ) {
                fetchNextPage();
            }
        });

        if(spinner.current) observador.observe( spinner.current );

        return () => observador.disconnect();
    }, [spinner, hasNextPage, isFetchingNextPage]);

    return (
        <div id="comentarios-post" className="w-full space-y-3">
            <div className="flex items-center gap-2 ml-4 md:ml-0">
                <MessageCircle className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Comentarios ({totalComentarios})</h3>
            </div>

            <Card className="border p-5 w-full">
                <CreateComment 
                    postId={postId}
                    createdAt={createdAt}
                    usuarioId={usuarioId}
                />
            </Card>

            { !comments.length &&
                <div className="flex justify-center py-5">
                    <p className="text-sm text-muted-foreground">Sé el primero en comentar</p>
                </div> 
            }
                       
            { comments.map(comment => (
                <Card
                    id={String(comment.id)}
                    key={comment.id}
                    className="border p-5 w-full"
                >
                    <Comment
                        postId={postId}
                        createdAt={createdAt}
                        comment={comment}
                        onReply={comentario => setCommentToReply(comentario)}
                    />                                          
                </Card>
            ))}

            { hasNextPage &&
                <div ref={spinner} className="flex justify-center">
                    <Spinner />
                </div>
            }

            { commentToReply &&
                <ReplyComment 
                    postId={postId}
                    createdAt={createdAt}
                    usuarioId={usuarioId}
                    comment={commentToReply}
                    onClose={() => setCommentToReply(null)}
                />
            }
        </div>        
    )
}