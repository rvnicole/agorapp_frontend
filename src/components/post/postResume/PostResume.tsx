import z from "zod";
import { MapPin, ThumbsUp, MessageCircle, Clock } from "lucide-react";
import type { PostsUsuarioRespuestaSchema } from "../../../schemas";
import { Card } from "../../ui/Card";
import { formatDate } from "../../../utils/date";
import Avatar from "../../ui/Avatar";

type PostResumeProps = z.infer<typeof PostsUsuarioRespuestaSchema>;

export default function PostResume( { postResumeData} : { postResumeData: PostResumeProps} ){
    return(
        <Card className="w-full border">
            {
                (postResumeData.imagenes && postResumeData.imagenes.length > 0) 
                &&
                <img
                    className="h-[55dvh] object-cover" 
                    src={postResumeData.imagenes[0].urlImg} 
                    alt={"img_" + postResumeData.titulo} 
                />
            }
            <div className="px-4 space-y-3">
                <h3 className="text-lg font-semibold">{postResumeData.titulo}</h3>
                <p className="text-sm text-muted-foreground">{postResumeData.descripcion}</p>
                <p className="flex space-x-1 items-center text-sm text-muted-foreground">
                    <MapPin className="size-4" />
                    <span>{"Av. Direccion de Ejemplo"}</span>
                </p>
            </div>
            <div className="flex flex-col space-y-7 md:space-y-0 md:flex-row md:justify-between px-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Avatar className=" size-10">
                        <img
                            className="w-full h-fit" 
                            src={postResumeData.url_img} 
                            alt="user-image" 
                        />
                    </Avatar>
                    <p>{postResumeData.alias}</p>
                </div>
                <div className="flex justify-center space-x-7">
                    <div className="flex items-center gap-1">
                        <ThumbsUp className="size-5"/>
                        <p>{postResumeData.total_likes}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <MessageCircle className="size-5"/>
                        <p>{postResumeData.total_comentarios}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="size-5"/>
                        <p className="text-[10px]">{formatDate(postResumeData.created_at)}</p>
                    </div>
                </div>
            </div>
        </Card>
    );
};