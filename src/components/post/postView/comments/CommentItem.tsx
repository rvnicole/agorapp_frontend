import { useState } from "react";
import { useUserStore } from "../../../../store/userStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMessageStore } from "../../../../store/messageStore";
import { Popover, PopoverContent, PopoverItem, PopoverTrigger } from "../../../ui/Popover";
import Avatar from "../../../ui/Avatar";
import EditComment from "./EditComment";
import { Button } from "../../../ui/Button";
import { deleteComment } from "../../../../api/CommentAPI";
import { formatDate } from "../../../../utils/date";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import type { ApiErrorType, Comentario, Post, PostRespuesta } from "../../../../types";

type CommentItem = {
    postId: Post["id"];
    createdAt: Post["createdAt"];
    comment: Comentario;
    replyCommentId?: Comentario["id"];
}

export default function CommentItem({ postId, createdAt, comment, replyCommentId }: CommentItem ) {
    const [edit, setEdit] = useState(false);
    const { user } = useUserStore( state => state );
    const { showMessages } = useMessageStore( state => state );

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: () => deleteComment({ 
            id: postId, 
            createdAt, 
            comentId: comment.id
        }),
        onSuccess: (data) => {
            if(data.success) {
                showMessages("success", "Comentario Eliminado");

                queryClient.setQueryData(
                    ["get-post", postId, createdAt], 
                    (oldData: PostRespuesta[]) => {
                        if (!oldData) return oldData;
    
                        const newData = {...oldData[0]};
                        newData.total_comentarios = newData.total_comentarios - 1
                        return [newData];
                    }
                );

                if( replyCommentId ) {
                    queryClient.setQueryData<Comentario[]>(
                        ["answers", replyCommentId], 
                        (old = []) => {
                            const filtered = old.filter(c => c.id !== comment.id);
                            return [...filtered];
                        }
                    );
                }
                else {
                    queryClient.setQueryData<{ pages: Comentario[][] }>(
                        ['comments', postId], 
                        (oldData) => {
                            if (!oldData) return oldData;
                        
                            const newPages = oldData.pages.map(page => {
                                return page.filter(c => c.id !== comment.id);
                            });
                        
                            return {...oldData, pages: newPages};
                        }
                    );
                }
            }
        },
        onError: (error: ApiErrorType) => {
            error.messages.forEach((error: string) => showMessages("error", error)); 
        }
    });
    
    return (
        <div className="flex items-start gap-2">
            <Avatar className={`${replyCommentId && "h-7 w-7 mt-1"}`} >
                <img 
                    className="w-full h-fit" 
                    src={comment.url_img || "/public/user-avar-default.jpg"} 
                />
            </Avatar>
            
            <div className="w-full">
                <div className="flex items-center justify-between">
                    <p className="font-semibold">{comment.alias} <span className="font-normal text-muted-foreground">{ comment.alias === user.alias && "(Tú)" }</span></p>
                    
                    <div className="flex gap-1 items-center">
                        <p className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</p> 

                        { user.alias === comment.alias &&
                            <Popover>
                                <PopoverTrigger>
                                    <Button 
                                        className="flex items-center justify-center rounded-full bg-transparent"
                                        variant="secondary"
                                        size="icon"
                                        disabled={edit}
                                    >
                                        <EllipsisVertical className="h-5 w-5 text-muted-foreground"/>
                                    </Button>
                                </PopoverTrigger>

                                { !edit &&
                                    <PopoverContent className="w-fit">
                                        <PopoverItem 
                                            key={`comment-edit-${comment.id}`}
                                            onClick={() => setEdit(true)}
                                        >
                                            <Pencil className="size-4"/>
                                            Editar
                                        </PopoverItem>

                                        <PopoverItem 
                                            key={`comment-delete-${comment.id}`}
                                            onClick={() => mutate()}
                                        >
                                            <Trash2 className="size-4"/>
                                            Eliminar
                                        </PopoverItem>
                                    </PopoverContent>
                                }
                            </Popover>
                        }
                    </div>                 
                </div> 

                { edit ?
                    <div className="mt-3">
                        <EditComment
                            postId={postId}
                            createdAt={createdAt}
                            comment={comment} 
                            replyCommentId={replyCommentId}
                            onClose={() => setEdit(false)} 
                        />
                    </div>                    
                    :
                    <p className="text-sm text-muted-foreground">{comment.comentario}</p>
                }
            </div>
        </div>
    )
}