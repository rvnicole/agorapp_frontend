import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useMessageStore } from "../../../store/messageStore";
import { useUserStore } from "../../../store/userStore";
import { Button } from "../../ui/Button";
import { updateLikeStatus } from "../../../api/PostAPI";
import { Loader2, ThumbsUp } from "lucide-react";
import type { ApiErrorType, Post } from "../../../types";

type LikedPost = {
    id: Post['id'];
    createdAt: Post['createdAt'];
    like: boolean;
}

export default function LikedPost({ id, like, createdAt }: LikedPost) {
    const [liked, setLiked] = useState<boolean>(like);

    const { showMessages } = useMessageStore( state => state );
    const { user: { alias } } = useUserStore( state => state );
    console.log("user-alias", alias);

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
            onClick={() => mutate({ id, liked, createdAt, alias })}
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