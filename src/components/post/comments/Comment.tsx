import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMessageStore } from "../../../store/messageStore";
import { Button } from "../../ui/Button";
import CommentItem from "./CommentItem";
import { APIAgorAppError } from "../../../errors/ApiError";
import { getCommentsAnswered } from "../../../api/CommentAPI";
import { ChevronDown, Loader2, Undo2 } from "lucide-react";
import type { Comentario, Post } from "../../../types"

type CommentProps = {
    postId: Post["id"],
    createdAt: Post["createdAt"],
    comment: Comentario,
    onReply: (comment: Comentario) => void
}

export default function Comment({ postId, createdAt, comment, onReply }: CommentProps) {
    const [showAnswers, setShowAnswers] = useState(false);
    const { showMessages } = useMessageStore( state => state );

    const { data: comments, refetch, isFetching } = useQuery({
        queryKey: ["answers", comment.id],
        queryFn: () => getCommentsAnswered({ 
            id: postId, 
            createdAt, 
            replyCommentId: comment.id 
        }),
        enabled: false,
        initialData: [],
        staleTime: Infinity
    });

    const onClickShowAnswers = async () => {
        const res = await refetch();

        if( !res.error ) {
            setShowAnswers(true);
            return;
        }

        if (res.error instanceof APIAgorAppError) {
            res.error.messages.forEach((error: string) => showMessages("error", error));
        }
    }

    return (
        <div className="w-full">
            <CommentItem comment={comment}/>

            <div className="ml-8 flex">
                <Button
                    variant="link"
                    size="sm"
                    className="flex items-center text-xs gap-1 -ml-2.5"
                    onClick={() => onReply(comment)}
                >
                    <Undo2 className="h-3.5 w-3.5"/>
                    Responder
                </Button>

                { comment.answered && !showAnswers && !isFetching &&
                    <Button
                        variant="link"
                        size="sm"
                        className="flex items-center text-xs"
                        onClick={onClickShowAnswers}
                    >
                        Ver respuestas 
                        <ChevronDown className="h-4 w-4 mt-1"/>
                    </Button>
                }

                { isFetching &&
                    <div className="flex items-center gap-1 ml-2 h-9">
                        <Loader2 className="h-3 w-3 animate-spin text-primary" />
                        <p className="text-xs text-primary">Cargando...</p>
                    </div> 
                }
            </div>
                
            { comments?.map(comentario => (
                <div key={comentario.id} className="ml-8 mt-5">
                    <CommentItem comment={comentario} isAnswer={true} />
                </div>
            ))}
        </div>
    )
}