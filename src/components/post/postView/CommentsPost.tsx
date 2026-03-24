import { Card } from "../../ui/Card";
import { MessageCircle } from "lucide-react";
import CreateComment from "../CreateComment";
import type { Post } from "../../../types";

type CommentsPostProps = {
    id: Post["id"],
    createdAt: Post["createdAt"]
    usuarioId: Post["usuarioId"]
}

export default function CommentsPost({ id, createdAt, usuarioId }: CommentsPostProps) {
    return (
        <div className="w-full space-y-3">
            <div className="flex items-center gap-2 ml-4 md:ml-0">
                <MessageCircle className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Comentarios</h3>
            </div>

            <Card className="border p-5 w-full">
                <CreateComment 
                    id={id}
                    createdAt={createdAt}
                    usuarioId={usuarioId}
                />              
            </Card> 
        </div>        
    )
}