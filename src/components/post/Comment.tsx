import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "../../store/userStore";
import { useMessageStore } from "../../store/messageStore";
import CreateComment from "./CreateComment";
import Avatar from "../ui/Avatar";
import { Button } from "../ui/Button";
import { getCommentsAnswered } from "../../api/CommentAPI";
import { formatDate } from "../../utils/date";
import { ChevronDown, Loader2 } from "lucide-react";
import type { ApiErrorType, Comentario, Post } from "../../types"

type CommentProps = {
    postId: Post["id"],
    createdAt: Post["createdAt"],
    usuarioId: Post["usuarioId"],
    comment: Comentario
}

export default function Comment({ postId, createdAt, usuarioId, comment }: CommentProps) {
    const [comments, setComments] = useState<Comentario []>([]);
    const hasFetched = useRef<boolean>(false);

    const { showMessages } = useMessageStore( state => state );

    const { mutate, isPending } = useMutation({
        mutationFn: getCommentsAnswered,
        onSuccess: (data: Comentario[] | undefined ) => {
            if( !data ) return;
            setComments(data);
            hasFetched.current = true;
        },
        onError: (error: ApiErrorType) => {
            error.messages.forEach((error: string) => {
                showMessages("error", error);
            }); 
        }
    });

    return (
        <div className="flex items-start gap-2">
            <Avatar>
                <img className="w-full" src={comment.url_img || "/public/user-avar-default.jpg"} />
            </Avatar>

            <div className="w-full">
                <CommentContent comment={comment}/>

                <CreateComment 
                    postId={postId}
                    createdAt={createdAt}
                    usuarioId={usuarioId}
                    replyCommentId={comment.id}
                    onSuccess={comentario => {
                        if( hasFetched.current ) {
                            setComments(c => ([ comentario, ...c ]));
                        } 
                        else if( !comment.answered ) {
                            comment.answered = true;
                        }
                    }}
                />

                { comment.answered && !hasFetched.current && !isPending &&
                    <Button
                        variant="link"
                        className="flex items-center text-xs"
                        onClick={() => mutate({ id: postId, createdAt, replyCommentId: comment.id })}
                    >
                        Ver respuestas 
                        <ChevronDown className="h-4 w-4 mt-1"/>
                    </Button>
                }

                { isPending &&
                    <div className="flex items-center gap-1 ml-2 h-9">
                        <Loader2 className="h-3 w-3 animate-spin text-primary" />
                        <p className="text-xs text-primary">Cargando...</p>
                    </div> 
                }

                
                { comments.map(comentario => (
                    <div key={comentario.id} className="flex items-start gap-2 mt-5">
                        <Avatar className="h-7 w-7 mt-1">
                            <img className="w-full" src={comentario.url_img || "/public/user-avar-default.jpg"} />
                        </Avatar>

                        <CommentContent comment={comentario}/>
                    </div>
                ))}
                
            </div>
        </div> 
    )
}

function CommentContent({ comment }: { comment: Comentario }) {
    const { user } = useUserStore( state => state );
    const { alias, comentario, created_at } = comment;

    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                <p className="font-semibold">{alias} <span className="font-normal text-muted-foreground">{ alias === user.alias && "(Tú)" }</span></p>
                <p className="text-xs text-muted-foreground">{formatDate(created_at)}</p> 
            </div> 

            <p className="text-sm text-muted-foreground">{comentario}</p>
        </div>
    )
}
