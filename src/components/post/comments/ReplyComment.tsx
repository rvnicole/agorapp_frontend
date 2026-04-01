import { Undo2, X } from "lucide-react";
import CreateComment from "./CreateComment";
import type { Comentario } from "../../../types";

type ReplyCommentProps = {
    postId: number,
    createdAt: string,
    usuarioId: number,
    comment: Comentario,
    onClose: () => void
};

export default function ReplyComment({ postId, createdAt, usuarioId, comment, onClose}: ReplyCommentProps) {
    return (
        <>
            <div className="h-14" />

            <div 
                className="fixed bottom-8 w-full lg:w-2xl p-2 left-1/2 right-auto -translate-x-1/2 
                bg-card/10 backdrop-blur-md rounded-xl z-60"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 py-1 text-primary text-xs ml-2 font-semibold">
                        <Undo2 className="h-3.5 w-3.5"/>
                        Responder a { comment.alias}
                    </div>

                    <button
                        className="text-primary p-2 mb-2 rounded-full  cursor-pointer hover:bg-muted"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4"/>
                    </button>
                </div>

                <CreateComment 
                    postId={postId}
                    createdAt={createdAt}
                    usuarioId={usuarioId}
                    replyCommentId={comment.id}
                />
            </div>
        </>
    )
}