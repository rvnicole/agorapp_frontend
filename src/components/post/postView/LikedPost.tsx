import { useMutation } from "@tanstack/react-query";
import { useMessageStore } from "../../../store/messageStore";
import { Button } from "../../ui/Button";
import { updateLikeStatus } from "../../../api/PostAPI";
import { Loader2, ThumbsUp } from "lucide-react";
import type { ApiErrorType, Post } from "../../../types";

type LikedPost = {
    id: Post['id'];
    createdAt: Post['createdAt'];
    liked: boolean;
}

export default function LikedPost({ id, liked, createdAt }: LikedPost) {
    const { showMessages } = useMessageStore( state => state );

    const { mutate, isPending } = useMutation({
        mutationFn: updateLikeStatus,
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (error: ApiErrorType) => {
            error.messages.forEach((error: string) => {
                showMessages("error", error);
            }); 
        }
    })
    
    return (
        <Button
            className="flex justify-center items-center gap-2 w-full"
            onClick={() => mutate({ id, liked, createdAt })}
        >
            { isPending ? 
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cargando...
                </>
                :
                liked ?
                    <>
                        <ThumbsUp className="h-5 w-5 fill-primary-foreground" />
                        Apoyando
                    </>
                    :
                    <>
                        <ThumbsUp className="h-5 w-5" />
                        Apoyar
                    </>
            }
        </Button>
    )
}