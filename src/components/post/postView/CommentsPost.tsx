import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useMessageStore } from "../../../store/messageStore";
import { Card } from "../../ui/Card";
import CreateComment from "../CreateComment";
import Comment from "../Comment";
import Spinner from "../../ui/Spinner";
import { getComments, getCommentsAnswered } from "../../../api/CommentAPI";
import { MessageCircle, Undo2, X } from "lucide-react";
import type { Answer, ApiErrorType, Comentario, Post } from "../../../types";

type CommentsPostProps = {
    postId: Post["id"],
    createdAt: Post["createdAt"]
    usuarioId: Post["usuarioId"],
    totalComentarios: Post["totalComentarios"]
}

export default function CommentsPost({ postId, createdAt, usuarioId, totalComentarios }: CommentsPostProps) {
    const [comments, setComments] = useState<Comentario []>([]);
    const [answer, setAnswer] = useState<number | null>(null);

    const [lastId, setLastId] = useState(0);
    const [lastResult, setLastResult] = useState(false);
    const spinner = useRef<HTMLDivElement>(null);

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
            error.messages.forEach((error: string) => showMessages("error", error));  
        }
    });

    const { mutate: mutateAnswer, isPending: isPendingAnswer } = useMutation({
        mutationFn: getCommentsAnswered,
        onSuccess: (data: Answer[] | undefined ) => {
            if( !data ) return;
            
            const commentId = data[0].answerTo;
            const comment = comments.find(c => c.id === commentId);
            if( !comment ) return;

            const newComments = comments.map(c => {
                if( c.id === comment.id ) {
                    c.answers = data;
                    c.answered = true;
                }

                return c;
            });

            setComments(newComments);
        },
        onError: (error: ApiErrorType) => {
            error.messages.forEach((error: string) => showMessages("error", error));
        }
    });

    useEffect(() => {
        const observador = new IntersectionObserver(arreglo => {
            if( arreglo[0].isIntersecting && !isPending ) {
                mutate({ id: postId, createdAt, lastId });
            }
        });

        if(spinner.current) observador.observe( spinner.current );

        if( lastResult ) observador.disconnect();

        return () => observador.disconnect();
    }, [spinner, isPending]);

    return (
        <div id="comentarios" className="w-full space-y-3">
            <div className="flex items-center gap-2 ml-4 md:ml-0">
                <MessageCircle className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Comentarios ({totalComentarios})</h3>
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
                        comment={comment}
                        isLoadingAnswers={isPendingAnswer}
                        onAnswer={id => setAnswer(id)}
                        onLoadAnswers={id => mutateAnswer({ id: postId, createdAt, replyCommentId: id })}
                    />                                          
                </Card>
            ))}

            { !lastResult &&
                <div ref={spinner} className="flex justify-center">
                    <Spinner />
                </div>
            }

            { answer &&
                <>
                    <div className="h-20" />

                    <div 
                        className="fixed bottom-8 left-4 w-2/3 right-20 p-1 md:p-2 md:left-1/2 md:right-auto md:-translate-x-1/2 
                        lg:w-full lg:max-w-2xl bg-card/10 backdrop-blur-md rounded-xl"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 py-1 text-primary">
                                <Undo2 className="h-3.5 w-3.5"/>
                                Responder a {comments.find(c => c.id === answer)?.alias}
                            </div>

                            <button
                                className="text-primary p-2 mb-2 rounded-full hover:bg-muted"
                                onClick={() => setAnswer(null)}
                            >
                                <X className="h-4 w-4 cursor-pointer"/>
                            </button>
                        </div>

                        <CreateComment 
                            postId={postId}
                            createdAt={createdAt}
                            usuarioId={usuarioId}
                            replyCommentId={answer}
                            onSuccess={ comentario => {
                                const comment: Answer = { ...comentario, answerTo: answer };

                                const newComments = comments.map(c => {
                                    if( c.id === answer ) {
                                        c.answers = c.answers ? [...c.answers, comment] : [comment];
                                        c.answered = true;
                                    }
                    
                                    return c;
                                });

                                setComments(newComments);
                            }}
                        />
                    </div>
                </>
            }
        </div>        
    )
}