import { useUserStore } from "../../store/userStore";
import { formatDate } from "../../utils/date";
import Avatar from "../ui/Avatar";
import type { Comentario } from "../../types";

type CommentItem = {
    comment: Comentario;
    isAnswer?: boolean;
}

export default function CommentItem({ comment, isAnswer }: CommentItem ) {
    const { user } = useUserStore( state => state );
    
    return (
        <div className="flex items-start gap-2">
            <Avatar className={`${isAnswer && "h-7 w-7 mt-1"}`} >
                <img 
                    className="w-full h-fit" 
                    src={comment.url_img || "/public/user-avar-default.jpg"} 
                />
            </Avatar>
            
            <div className="w-full">
                <div className="flex items-center justify-between">
                    <p className="font-semibold">{comment.alias} <span className="font-normal text-muted-foreground">{ comment.alias === user.alias && "(Tú)" }</span></p>
                    <p className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</p> 
                </div> 

                <p className="text-sm text-muted-foreground">{comment.comentario}</p>
            </div>
        </div>
    )
}