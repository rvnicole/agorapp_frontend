import CreateComment from "./CreateComment";
import Avatar from "../ui/Avatar";
import { formatDate } from "../../utils/date";
import type { Comentario, Post } from "../../types"

type CommentProps = {
    postId: Post["id"],
    createdAt: Post["createdAt"],
    usuarioId: Post["usuarioId"],
    comment: Comentario
}

export default function Comment({ postId, createdAt, usuarioId, comment }: CommentProps) {
    const { id, alias, comentario, created_at, url_img } = comment;
    const avatar = url_img || "/public/user-avar-default.jpg";

    return (
        <div className="flex items-start gap-2">
            <Avatar>
                <img src={avatar} />
            </Avatar>

            <div className="w-full">
                <div className="flex items-center justify-between">
                    <p className="font-semibold">{alias}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(created_at)}</p> 
                </div> 

            <p className="text-sm text-muted-foreground">{comentario}</p>

            <CreateComment 
                postId={postId}
                createdAt={createdAt}
                usuarioId={usuarioId}
                replyCommentId={id}
            />
            </div>
        </div> 
    )
}