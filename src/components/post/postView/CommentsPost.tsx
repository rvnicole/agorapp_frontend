import { useState } from "react";
import { useUserStore } from "../../../store/userStore";
import { Card } from "../../ui/Card";
import CreateComment from "../CreateComment";
import Modal from "../../ui/Modal";
import { formatDate } from "../../../utils/date";
import { MessageCircle, Undo2 } from "lucide-react";
import type { Comentario, Post } from "../../../types";

type CommentsPostProps = {
    id: Post["id"],
    createdAt: Post["createdAt"]
    usuarioId: Post["usuarioId"],
    comentarios?: Comentario[]
}

type Comments = Comentario & { comentarios?: Comentario[] };

const sortComments = (comentarios: Comentario[]) => {
    
}


export default function CommentsPost({ id, createdAt, usuarioId, comentarios }: CommentsPostProps) {
    const [comments, setComments] = useState(comentarios || []);
    const [replyTo, setReplyTo] = useState<string | null>();

    const { user: { alias } } = useUserStore( state => state );

    return (
        <div className="w-full space-y-3">
            <div className="flex items-center gap-2 ml-4 md:ml-0">
                <MessageCircle className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Comentarios ({comments.length})</h3>
            </div>

            <Card className="border p-5 w-full">
                <CreateComment 
                    id={id}
                    createdAt={createdAt}
                    usuarioId={usuarioId}
                    onSuccess={(comentario) => {
                        setComments(c => [comentario, ...c]);
                    }}
                />
            </Card>

            { comments.map(comment => {
                const { comentId, usuario, comentario, fecha } = comment;

                return (
                    <Card
                        key={comentId}
                        className="border p-5 w-full"
                    >
                        <div>
                            <div className="flex items-center justify-between">
                                <p className="font-semibold">{usuario}</p>
                                <p className="text-xs text-muted-foreground">{formatDate(fecha)}</p> 
                            </div>

                            <p className="text-sm text-muted-foreground">{comentario}</p>

                            <div 
                                className="flex items-center gap-1 py-1 w-fit cursor-pointer group"
                                onClick={() => setReplyTo(usuario)}
                            >
                                <Undo2 className="w-3 h-3 text-muted-foreground" />
                                <p className="text-xs font-semibold text-muted-foreground group-hover:underline">Responder</p>
                            </div>
                        </div>                        
                    </Card>
                )
            })}

            <Modal 
                open={Boolean(replyTo)}
                onClose={() => setReplyTo(null)}
            >
                <div className="space-y-2">
                    <div className="flex items-center gap-1">
                        <Undo2 className="w-5 h-5 text-muted-foreground" />
                        <p className="font-semibold text-muted-foreground">Responder a {replyTo} { alias === replyTo && "(Tú)"}</p>
                    </div>

                    <CreateComment 
                        id={id}
                        createdAt={createdAt}
                        usuarioId={usuarioId}
                        onSuccess={(comentario) => {
                            setComments(c => [comentario, ...c]);
                        }}
                    />
                </div>                
            </Modal>
        </div>        
    )
}