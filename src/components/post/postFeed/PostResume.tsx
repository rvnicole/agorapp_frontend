import z from "zod";
import { MapPin, ThumbsUp, MessageCircle, Clock, Share2 } from "lucide-react";
import type { PostsUsuarioRespuestaSchema } from "../../../schemas";
import { Card } from "../../ui/Card";
import { formatDate } from "../../../utils/date";
import Avatar from "../../ui/Avatar";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import type { Post, UserData } from "../../../types";
import { updateLikeStatus } from "../../../api/PostAPI";
import { useMessageStore } from "../../../store/messageStore";
import { useState } from "react";
import { useShare } from "../../../hooks/useShare";

export type PostResumeProps = z.infer<typeof PostsUsuarioRespuestaSchema>;

export default function PostResume( { postResumeData} : { postResumeData: PostResumeProps} ){
    const urlPost = `/post/${postResumeData.tipo}/${postResumeData.id}?createdAt=${postResumeData.created_at}`;
    const [currentLike, setCurrentLike] = useState({ number: postResumeData.total_likes, liked: postResumeData.liked });
    const { sharePost } = useShare();
    const showMessage = useMessageStore(state => state.showMessages);
    const { mutate } = useMutation({
        mutationFn: (payload: Pick<Post, "id"|"liked"|"createdAt"> & Pick<UserData, "alias">) => updateLikeStatus(payload),
        mutationKey: ["likePost"],
        onError: (error) => {
            showMessage("error", error.message);
        }
    });

    const handleClickLike = async () => {
        if( !currentLike.liked ){
            setCurrentLike( (state) => ({ number: state.number + 1, liked: true }));
            mutate({
                id: postResumeData.id,
                createdAt: postResumeData.created_at,
                alias: postResumeData.alias
            });
        }
        else{
            setCurrentLike( (state) => ({ number: state.number - 1, liked: false }));
            mutate({
                id: postResumeData.id,
                createdAt: postResumeData.created_at,
                liked: true
            });
        };
    };

    return(
        <Card className="w-full border">
            <div className="space-y-4">
            <Link 
                className="cursor-pointer"
                to={urlPost}
            >
                {
                    (postResumeData.imagenes && postResumeData.imagenes.length > 0) 
                    &&
                        <img
                            className="h-[40dvh] md:h-96 w-full object-cover md:object-center mb-3" 
                            src={postResumeData.imagenes[0].urlImg} 
                            alt={"img_" + postResumeData.titulo} 
                            loading="lazy"
                        />
                    
                }
                <div className="px-4 space-y-2 mt-4">
                    <h3 className="text-lg font-semibold">{postResumeData.titulo}</h3>
                    <p className="text-sm text-muted-foreground">{postResumeData.descripcion}</p>
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2">
                            <Avatar className=" size-7">
                                    <img
                                        className="w-full h-fit" 
                                        src={postResumeData.url_img} 
                                        alt="user-image" 
                                    />
                            </Avatar>
                            <p className="text-sm font-semibold text-muted-foreground">{postResumeData.alias}</p>
                        </div>
                        <p className="flex space-x-1 items-center text-sm text-muted-foreground">
                            <span><MapPin className="size-4" /></span>
                            <span className="text-xs">{postResumeData.direccion}</span>
                        </p>
                        <p className="flex space-x-1 items-center text-xs text-muted-foreground">
                            <Clock className="size-4" />
                            <span>{formatDate(postResumeData.created_at)}</span>
                        </p>
                    </div>
                </div>
            </Link>
            <div className="mx-4 mt-3 h-px bg-muted-foreground/40" />
            <div className="flex flex-col md:space-y-0 md:flex-row md:justify-between px-4 text-sm text-muted-foreground">
                
                <div className="flex justify-around w-full md:w-auto md:justify-center space-x-7">
                    <div 
                        className="flex items-center gap-1"
                        onClick={handleClickLike}
                    >
                        <ThumbsUp className={`size-5 cursor-pointer ${ currentLike.liked ? "fill-accent" : ""}`}/>
                        <p>{currentLike.number}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <Link to={urlPost + "#comentarios"}>
                            <MessageCircle className="size-5"/>
                        </Link>
                        <p>{postResumeData.total_comentarios}</p>
                    </div>
                    <div 
                        className="flex items-center gap-1"
                        onClick={() => sharePost(postResumeData)}
                    >
                        <Share2 className="size-5 cursor-pointer"/>
                    </div>
                </div>
            </div>
            </div>
        </Card>
    );
};