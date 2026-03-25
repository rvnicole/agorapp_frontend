import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useMessageStore } from "../../../store/messageStore";
import { useUserStore } from "../../../store/userStore";
import { Button } from "../../ui/Button";
import { updateLikeStatus } from "../../../api/PostAPI";
import { ThumbsUp, UsersRound } from "lucide-react";
import type { ApiErrorType, Post } from "../../../types";

type LikedPost = {
    id: Post['id'];
    createdAt: Post['createdAt'];
    like: boolean;
    totalLikes: number;
}

export default function LikedPost({ id, like, createdAt, totalLikes }: LikedPost) {
    const [liked, setLiked] = useState<boolean>(like);
    const [total, setTotal] = useState<number>(totalLikes);

    const { showMessages } = useMessageStore( state => state );
    const { user } = useUserStore( state => state );

    const { mutate } = useMutation({
        mutationFn: updateLikeStatus,
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (error: ApiErrorType) => {
            error.messages.forEach((error: string) => showMessages("error", error)); 
        }
    })
    
    return (
        <div className="flex flex-col md:flex-row items-center gap-4">
            <Button
                className="flex justify-center items-center gap-2 w-full"
                onClick={() => {
                    mutate({ id, liked, createdAt, alias: user.alias });
                    setLiked(l => {
                        if( l ) {
                            setTotal(t => t - 1);
                            return false;
                        }
                        else {
                            setTotal(t => t + 1);
                            return true;
                        }
                    });
                }}
            >
                { liked ?
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

            <div className="flex flex-row md:flex-col gap-1 items-center justify-center">
                <div className="flex items-center justify-center gap-1">
                    <UsersRound  className="h-5 w-5"/>
                    <p className="text-2xl font-bold">{total}</p>
                </div>
                
                <p className="text-center text-xs text-muted-foreground">Personas de acuerdo</p>
            </div>
        </div>
    )
}