import { useRef } from "react";
import { Button } from "../ui/Button";
import CommentItem from "./CommentItem";
import { ChevronDown, Loader2, Undo2 } from "lucide-react";
import type { Comentario } from "../../types"

type CommentProps = {
    comment: Comentario,
    isLoadingAnswers: boolean,
    onAnswer: (id: Comentario["id"]) => void,
    onLoadAnswers: (id: Comentario["id"]) => void
}

export default function Comment({ comment, isLoadingAnswers, onAnswer, onLoadAnswers }: CommentProps) {
    const hasFetched = useRef(false);

    return (
        <div className="w-full">
            <CommentItem comment={comment}/>

            <div className="ml-8 flex">
                <Button
                    variant="link"
                    size="sm"
                    className="flex items-center text-xs gap-1 -ml-2.5"
                    onClick={() => onAnswer(comment.id)}
                >
                    <Undo2 className="h-3.5 w-3.5"/>
                    Responder
                </Button>

                { comment.answered && !hasFetched.current && !isLoadingAnswers &&
                    <Button
                        variant="link"
                        size="sm"
                        className="flex items-center text-xs"
                        onClick={() => {
                            hasFetched.current = true;
                            onLoadAnswers(comment.id);
                        }}
                    >
                        Ver respuestas 
                        <ChevronDown className="h-4 w-4 mt-1"/>
                    </Button>
                }

                { isLoadingAnswers &&
                    <div className="flex items-center gap-1 ml-2 h-9">
                        <Loader2 className="h-3 w-3 animate-spin text-primary" />
                        <p className="text-xs text-primary">Cargando...</p>
                    </div> 
                }
            </div>
                
            { comment.answers?.map(comentario => (
                <div key={comentario.id} className="ml-8 mt-5">
                    <CommentItem comment={comentario} isAnswer={true} />
                </div>
            ))}
        </div>
    )
}
